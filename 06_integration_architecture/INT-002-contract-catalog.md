# INT-002 — каталог междоменных контрактов

**Версия 1.1 · 12.11.2026 · Проект контрактов**

Идентификаторы API и EVT ниже — общие ссылки для схем всех команд. Endpoint — предлагаемый публичный путь **внутреннего** Gateway, а не существующий URL или обязательный путь внутри legacy-системы. Права определяются по потребителю и операции. Внешний браузер не вызывает ERP/WMS/CRM напрямую.

## 1. Общие идентификаторы

| Поле | Владелец и смысл |
|---|---|
| productId, supplierId, purchaseId | ERP; стабильные межсистемные ключи товара, поставщика и закупки |
| customerId | CRM; отличается от subject и channelAccountId. Наличие ID не даёт прав |
| orderId + orderVersion | Заказ интернет-канала; сохраняются на всех шагах и в ERP |
| erpOrderId | Учётный заказ ERP; внешний orderId уникален в пределах канала |
| reservationId, taskId, receiptId, movementId | WMS; факты приёмки/движения не идентифицируются только purchaseId |
| saleId | Для POS: устойчивый ID продажи, включая storeId/registerId/receiptId, а не один номер чека. Для ERP: ID финансовой записи со ссылкой на исходную продажу/заказ |
| paymentAttemptId, paymentId, refundId | Попытка инициатора и подтверждённые ID провайдера; новая попытка не создаётся из-за таймаута |
| shipmentId, trackingId, returnId | Бизнес-отгрузка, ID перевозчика и возврат; связаны с исходным заказом |
| bonusHoldId, bonusOperationId | Авторитетная операция Loyalty/CRM; не вычисляется из локального баланса |
| priceSnapshotId, discountQuoteId | Подтверждённые цены ERP и персональная скидка CRM/Loyalty, связанные с клиентом, составом и версией заказа; отдельно от бонусной операции |
| locationType + locationId | CENTRAL/STORE и конкретное место хранения. Строка количества без места непригодна для междоменных обменов |
| commandId, eventId, operationId, correlationId | Поручение, неизменный ID факта, операция обработки, цепочка трассировки; эти четыре значения не взаимозаменяемы |

Время передаётся в UTC с часовым поясом; деньги — целое число минимальных денежных единиц + currency. Количество — десятичная строка + unitCode, без двоичной плавающей арифметики. Для штучного товара дробное количество отклоняется. Телефон/email не используются в качестве общего бизнес-ключа.

## 2. Правила команд и запросов

Обязательны service identity, разрешённый scope и X-Correlation-Id; для изменяющих операций — Idempotency-Key и commandId. Получатель хранит результат вместе с ключом и hash тела. Для конкурентных переходов передаётся expectedVersion. Повтор с тем же ключом и телом возвращает тот же логический результат; другой payload — `409 IDEMPOTENCY_CONFLICT`.

`200/201` с businessStatus=SUCCEEDED означает подтверждённый результат исполнителя. `202` содержит operationId и statusUrl и означает только устойчивый приём. `GET /integration/v1/operations/{operationId}` возвращает deliveryStatus, businessStatus (PENDING/SUCCEEDED/REJECTED/UNKNOWN), ownerSystem, resourceId, resultVersion и error при наличии. HTTP `200` у status endpoint не означает businessStatus=SUCCEEDED. Для UNKNOWN адаптер уточняет результат у системы по commandId/внешнему бизнес-ID. Утрата HTTP-ответа не порождает новую операцию.

Общая ошибка: code, message без чувствительных данных, retryable, correlationId, operationId при наличии. `400/422` — форма/валидация; `401/403` — права; `409` — бизнес-конфликт или версия; `429/503` — возможный технический повтор с прежним ключом и Retry-After. Повтор после deadline проверяет актуальность бизнес-условий, даже если доставка разрешена.

## 3. Каталог API и команд

Во всех строках межсистемный транспорт — Integration Platform. «Устойчиво» означает сохранённую команду и отдельное подтверждение результата. Получатель может дать немедленный бизнес-ответ, если уложился в бюджет.

| ID | Инициатор → владелец | Операция / режим | Минимальный вход → результат |
|---|---|---|---|
| API-01 | E-commerce/POS → CRM | `POST /customers/v1/profile-links`; синхронно либо PENDING | channelId, channelAccountId, проверенные атрибуты → customerId, version; уникальный внешний ключ |
| API-02 | Канал → CRM | `PATCH /customers/v1/profiles/{id}`; команда | разрешённые изменения, expectedVersion → версия профиля; не меняет бонусный баланс |
| API-03 | Канал → ERP | `POST /erp/v1/order-prices`; синхронно | orderId/orderVersion либо sourceSaleId, channelId, locationId, строки → priceSnapshotId, базовые цены/суммы строк, применённые общие акции и их версии, priceVersion, currency, validUntil; без персональной скидки |
| API-04 | Онлайн/ERP → WMS | `GET /warehouse/v1/stocks`; синхронно | warehouseId, productId → onHand/reserved/blocked/available, version, asOf; **не резерв** |
| API-05 | Онлайн/ERP → WMS | `POST /warehouse/v1/reservations`; синхронно | orderId/orderVersion, warehouseId, строки → reservationId, ACTIVE, expiresAt, version; все строки атомарно |
| API-06 | Владелец заказа → WMS | `GET /warehouse/v1/reservations/{id}` либо поиск по orderId/orderVersion | Текущее состояние, version, expiresAt, taskId/paymentId при наличии; расширение WH-каталога для восстановления |
| API-07 | Координатор по правилам онлайн → WMS | `POST /warehouse/v1/reservations/{id}/confirm-paid`; команда | orderId/orderVersion, paymentId, expectedVersion → HELD_FOR_FULFILLMENT, version; **новое расширение**, только действующий ACTIVE |
| API-08 | Владелец заказа → WMS | `POST /warehouse/v1/reservations/{id}/release`; команда | reason, expectedVersion → RELEASED; для оплаченного удержания нужна подтверждённая отмена, для ALLOCATED — API-12 |
| API-09 | Онлайн → провайдер через Payment Adapter | `POST /payments/v1/attempts`; команда | orderId/orderVersion, paymentAttemptId, amountMinor/currency, priceSnapshotId, discountQuoteId/согласованный режим без скидки, priceConfirmedAt → paymentId, status, session expiresAt, безопасная redirect-ссылка; сумма сверена со снимком канала |
| API-10 | Онлайн → ERP | `POST /erp/v1/online-orders`; устойчиво | orderId/orderVersion, customerId, цены и персональные скидки по строкам, priceSnapshotId, discountQuoteId/версии правил либо согласованный режим без скидки, priceConfirmedAt, итог, reservationId, подтверждения оплаты/бонусов → erpOrderId, version; сохраняется оплаченная стоимость |
| API-11 | **Только ERP** → WMS | `POST /warehouse/v1/fulfillment-tasks`; устойчиво | orderId/orderVersion, erpOrderId, reservationId, требуемые данные передачи → taskId, state, version; прежний резерв |
| API-12 | ERP по запросу владельца заказа → WMS | `POST /warehouse/v1/fulfillment-tasks/{id}/cancel`; устойчиво | expectedVersion, reason → CANCELLED / PENDING_PHYSICAL_RETURN / REJECTED_AFTER_HANDOVER |
| API-13 | Координатор онлайн → перевозчик через Delivery Adapter | `POST /delivery/v1/shipments`; устойчиво | shipmentId, taskId, orderId, согласованные параметры передачи и контакты → trackingId, status; одна заявка на shipmentId |
| API-14 | Онлайн/финансы → Payment Adapter → провайдер | `POST /payments/v1/refunds`; устойчиво | refundId, paymentId, orderId/returnId, amountMinor/currency, reason → providerRefundId и подтверждённый статус |
| API-15 | ERP/закупки → WMS | `PUT /warehouse/v1/expected-receipts/{externalId}`; устойчиво | purchaseId, expectedReceiptId, version, строки → принятая версия плана; соответствует WH API-04 |
| API-16 | ERP/закупки → поставщик через Supplier Adapter | `PUT /suppliers/v1/orders/{purchaseId}`; устойчиво | supplierId, версия заказа, строки/условия → supplierOrderId, acknowledgement/status; acknowledgement не является приёмкой |
| API-17 | Канал → Loyalty → CRM | `POST /loyalty/v1/holds`; синхронно | customerId, orderId/orderVersion либо sourceSaleId, priceSnapshotId/discountQuoteId, запрошенные бонусы, expectedVersion → bonusHoldId, heldBonusUnits, redemptionAmountMinor, currency, expiresAt; отдельное удержание бонусов с проверкой совместимости со скидкой |
| API-18 | Канал/координатор → Loyalty → CRM | `POST /loyalty/v1/holds/{id}/commit` или `/release`; команда | ID покупки, основание, expectedVersion → bonusOperationId и итог; атомарное применение в авторитетном счёте |
| API-19 | Канал → Recommendation Service | `GET /recommendations/v1/sets`; синхронно, ограниченное ожидание | placement, context, проверенный customerId при наличии → generationId/setId, productId/rank, validUntil; без цены и обещания наличия |
| API-20 | Разрешённый потребитель → источник | Контрольный снимок через адаптер; пакетно | snapshotId/cursor → данные одной границы, sourceVersion/watermark; WMS: `/warehouse/v1/stock-snapshots/{id}/items` |
| API-21 | Онлайн → ERP | `POST /erp/v1/online-orders/{orderId}/cancel`; устойчиво | orderVersion, reason → устойчивый запрет поздней регистрации/исполнения, даже если заказ ещё не создан, и результат уже созданного задания; **новое согласование** для компенсации |
| API-22 | Канал/ERP → контур возврата | `POST /returns/v1/requests`; устойчиво | returnId, orderId/saleId, строки, причина → согласованный маршрут; владелец процесса — коммерция/финансы, физический факт — WMS |
| API-23 | Кампании/онлайн → адаптер коммуникаций | `POST /communications/v1/messages`; устойчиво | messageId, templateId, recipientRef, purpose, consent reference → providerMessageId/status; маркетинговые разрешения проверяет Campaign |
| API-24 | Координатор → платёжный адаптер | `GET /payments/v1/attempts/{paymentAttemptId}` и `GET /payments/v1/refunds/{refundId}` | Авторитетно сверенный статус/UNKNOWN; опрос провайдера, повтор не списывает деньги |
| API-25 | ERP/координатор/онлайн → WMS | `GET /warehouse/v1/fulfillment-tasks/{id}` | state, version, исключения; соответствует WH API-07, используется перед компенсацией |
| API-26 | Координатор онлайн по согласованным правам → WMS | `PUT /warehouse/v1/fulfillment-tasks/{id}/handover-plan`; команда | shipmentId, trackingId, перевозчик, параметры передачи, expectedVersion → версия плана; не создаёт новое задание и не подтверждает физическую передачу |
| API-27 | Владелец заказа/финансы → Loyalty → CRM | `POST /loyalty/v1/operations/{id}/reverse`; устойчиво | reversalId, исходный bonusOperationId, orderId/returnId, сумма/строки → подтверждённый возврат списанных бонусов; предел — невозвращённая часть исходного списания |
| API-28 | Канал → Loyalty / CRM | `POST /loyalty/v1/discount-quotes`; синхронно | customerId из проверенной сессии/карты, orderId/orderVersion либо sourceSaleId, priceSnapshotId, строки/общие акции ERP → discountQuoteId, привязка к клиенту/составу/снимку цены, скидки и основания по lineId, totalDiscountMinor, currency, ruleVersion, validUntil, условия совместимости с бонусами; сумма 0 означает подтверждённое отсутствие скидки |

Внутренние складские confirm receipt/handover/inventory approve и локальные Payment/Fiscal POS сохраняются в каталогах владельцев. Публичный общий каталог не даёт онлайн-клиенту права выполнять эти функции. Протокол Identity/SSO и конкретные права включаются в системные контракты владельца идентификации; его события не являются источником клиентского профиля CRM.

Существующие WH API-02/03/06/08 сопоставлены с общими API-05/08/11/12. Нумерации различаются по namespace: на схеме пишется `INT API-05` или `WH API-02`, а не неоднозначное «API-02». `confirm-paid`, поиск резерва и атомарная отмена ERP — предлагаемые расширения, а не уже имеющиеся возможности.

### Цена, персональная скидка и бонусы

API-03 выполняется ERP, API-28 — CRM/Loyalty; оба идут через IS-07. Отдельный сервис цен отсутствует. Loyalty проверяет применимость скидки к конкретному customerId и составу с учётом общих акций ERP; подтверждение API-28 не меняет бонусный баланс. Использование бонусов требует отдельного API-17/18. В базовом контракте API-28 оценивает правила персональной скидки; одноразовые купоны с погашением требуют отдельной операции и не выводятся из этого чтения.

Backend канала сохраняет исходные цены ERP, суммы/основания персональных скидок, подтверждённую денежную часть бонусов и итог по строкам. Изменение customerId, количества, состава или priceSnapshotId требует нового API-28; перенос чужого подтверждения запрещён. До начала оплаты действуют сроки всех применяемых подтверждений, после оплаты сохраняется исторический снимок. ERP при регистрации сверяет исходные подтверждения и стоимость покупки, а не текущий прайс. Неизвестный результат Loyalty не равен скидке 0; режим без скидки требует явного выбора покупателя и допустимой политики канала.

## 4. Оболочка событий

Обязательный минимум совместим с ADR-EC-001 и WH-API-001: eventId, eventType, schemaVersion, aggregateId, aggregateVersion, occurredAt, correlationId, payload. Для общей платформы добавляются обязательные source и aggregateType; causationId рекомендуется для связи с породившей командой. Это проектная оболочка RetailMax; соответствие CloudEvents не заявляется.

Имена имеют формат `<domain>.<entity>.<fact>.v1`. В eventType находится major-версия семантики, schemaVersion — версия схемы. Новое необязательное поле совместимо только если потребители умеют игнорировать неизвестное. Изменение смысла, типа или обязательности требует новой major-версии и периода совместной поддержки с одним владельцем записи.

Схемы и пример: [общая оболочка](contracts/event-envelope.schema.json), [Stock payload](contracts/stock-changed.schema.json), [пример Stock](contracts/stock-changed.example.json). Это образец уровня контракта; OpenAPI всех операций и схемы остальных payload выпускают владельцы до реализации.

## 5. Каталог событий

| ID | Event type | Авторитетный издатель → подписчики | Ключевые данные / правило |
|---|---|---|---|
| EVT-01 | `erp.product.changed.v1` | ERP → каталоги POS/онлайн, WMS, DWH/Recommendations | Product: productId, unitCode, status, version; проекции не становятся мастерами |
| EVT-02 | `erp.price.changed.v1` | ERP → POS/онлайн, DWH | Price: productId, channel/location scope, версия, validFrom/validUntil; мастер цены — ERP |
| EVT-03 | `marketing.promotion.changed.v1` | Campaign → ERP, POS/онлайн, DWH | Promotion: promotionId, version, validity, применимость; ERP применяет согласованные общие правила, Loyalty учитывает их в API-28 по снимку ERP |
| EVT-04 | `warehouse.stock.changed.v1` | WMS → ERP, онлайн, закупки, DWH | Stock: полный снимок productId/warehouseId, количества, unitCode, version/asOf; единственное обновление проекции центрального количества |
| EVT-05 | `warehouse.reservation.changed.v1` | WMS → координатор/владелец заказа | Reservation: orderId/orderVersion, status, expiresAt, version; HELD_FOR_FULFILLMENT требует новой согласованной семантики enum |
| EVT-06 | `erp.order.registered.v1` | ERP → онлайн/координатор, DWH | Order: orderId, erpOrderId, version; не подтверждение подбора |
| EVT-07 | `warehouse.task.state-changed.v1` | WMS → ERP, онлайн/координатор | FulfillmentTask: taskId, orderId, status/reasonCode, version; READY_TO_HANDOVER разрешает заявку доставки |
| EVT-08 | `warehouse.shipment.handed-over.v1` | WMS → ERP, онлайн/розница, DWH | Shipment: shipmentId, taskId, строки, время передачи; ещё не DELIVERED |
| EVT-09 | `delivery.shipment.delivered.v1` | Подтверждённый факт перевозчика через адаптер → онлайн, ERP, DWH | ShipmentDelivery: trackingId, shipmentId, deliveredAt, version; сообщение перевозчика сверяется и дедуплицируется |
| EVT-10 | `payment.payment.succeeded.v1` | Подтверждённый факт провайдера через адаптер → онлайн/координатор, ERP | Payment: paymentAttemptId/paymentId, orderId, amountMinor/currency; не выручка и не резерв |
| EVT-11 | `payment.refund.succeeded.v1` | Провайдер через адаптер → онлайн/ERP, DWH | Refund: refundId/paymentId, amountMinor/currency, returnId при наличии; исходный платёж не переписывается |
| EVT-12 | `warehouse.receipt.confirmed.v1` | WMS → Delivery Control/ERP, DWH | Receipt: receiptId, purchaseId, expectedReceiptId, принятые/отклонённые строки, movementIds, расхождения; отдельное событие на каждую приёмку |
| EVT-13 | `warehouse.inventory.adjusted.v1` | WMS → ERP, аудит/DWH | InventoryCount: основание, movementIds, version; количество в проекции всё равно меняет EVT-04 |
| EVT-14 | `procurement.purchase.approved.v1` | ERP/закупки → Supplier Adapter/координатор, DWH | Purchase: purchaseId, version, supplierId, строки; инициирует доставку API-16, не заменяет команду API-15 |
| EVT-15 | `supplier.order.acknowledged.v1` | Поставщик через адаптер → ERP/закупки | SupplierOrder: purchaseId, supplierOrderId, версия, согласованные строки/срок; расхождение требует решения закупок |
| EVT-16 | `pos.sale.completed.v1` | POS → ERP, STORE Inventory, CRM/DWH | Sale: saleId, storeId/registerId, locationType=STORE, строки с ценами и применёнными скидками/основаниями, итог, payment/fiscal/bonus references, customerId при наличии; факт продажи канала |
| EVT-17 | `erp.sale.posted.v1` | ERP → Loyalty, CRM, DWH | FinancialSale: saleId ERP, sourceSaleId либо orderId, channelId, строки/сумма, финансовый статус; единственный триггер начисления в предлагаемой базовой модели |
| EVT-18 | `erp.sale.reversed.v1` | ERP → Loyalty, CRM, DWH | SaleReversal: reversalId, originalSaleId, returnId, строки/сумма; частичный возврат сторнирует только соответствующую часть |
| EVT-19 | `crm.customer.changed.v1` | CRM → разрешённые проекции каналов и DWH | Customer: customerId, version, разрешённый минимальный состав; контакты не широковещательно |
| EVT-20 | `loyalty.account.changed.v1` | Loyalty после транзакции CRM → каналам, DWH | BonusAccount: customerId/accountId, version, bonusOperationId; кэш не разрешает новое списание |
| EVT-21 | `commerce.behavior.observed.v1` | Онлайн/POS → разрешённый аналитический контур | Behavior: eventId, kind=impression/click/add_to_cart, productId, setId/generationId, placement, допустимый контекст; API-запрос не равен показу |
| EVT-22 | `crm.personalization.permission-changed.v1` | CRM → Recommendations, Campaign, DWH, канальные проекции | Permission: customerId, scope, allowed, effectiveAt, version; запрет инвалидирует наборы и их откат |
| EVT-23 | `commerce.order.completed.v1` | Онлайн после согласованных подтверждений → CRM/DWH | OnlineOrder: orderId, erpOrderId, paymentId, delivered shipment references; операционное завершение, не второй финансовый факт |
| EVT-24 | `communications.message.status-changed.v1` | Провайдер через адаптер → Campaign/онлайн, DWH | Message: messageId, providerMessageId, status; «принято» и «доставлено» различаются |

Stock — полный снимок агрегата; более новая версия может заменить старую без суммирования дельт. Receipt, Sale и Movement — факты: их нельзя потерять по правилу «оставить последнюю версию». Для них дедуплицируется ID факта и контролируется полнота журнала/снимком. Отсутствие номера версии в отфильтрованной подписке не обязательно означает потерю сообщения; последовательность и курсор определены источником.

В предлагаемом Stock-контракте `reserved` включает активные, оплаченные удержания и ALLOCATED до физической передачи; они не суммируются повторно. `available = onHand - reserved - blocked ≥ 0`. При handover WMS в одной операции уменьшает onHand и соответствующую часть reserved и публикует новый снимок. Правило единиц и формула согласуются с Warehouse; преобразование внутренних полей WMS выполняет её адаптер.

Для legacy/внешней системы source обозначает источник бизнес-факта. Адаптер формирует стабильные eventId и версию по журналу источника/собственному устойчивому соответствию. Он не публикует SUCCEEDED по одному транспортному ACK. CDC отражает только подтверждённые изменения и преобразуется в бизнес-контракт; сырой поток таблиц не подменяет SalePosted.

## 6. Правила против двойного эффекта

| Участок | Правило |
|---|---|
| Online → ERP → WMS | Один orderId/orderVersion; один ранний reservationId; одно активное исполнение; API-11 инициирует только ERP |
| POS + ERP → Loyalty | EVT-16 сохраняет историю, EVT-17 начисляет. Старый обработчик начисления по SaleCompleted выключается при переключении; бизнес-уникальность по исходной покупке сохраняется при миграции |
| WMS Stock + Shipment + Receipt | Количество обновляется только EVT-04. Receipt/Shipment используются как факты, а не дополнительные дельты остатка |
| Повторная приёмка закупки | Уникальные receiptId/movementIds; purchaseId не является ключом дедупликации всей поставки |
| Скидка + бонусы + деньги | Персональная скидка API-28 уменьшает стоимость один раз; API-17 отдельно подтверждает денежную часть бонусов. Итог и основания сохраняются; бонусный commit/refund не повторно применяет скидку |
| Snapshot + stream | Зафиксировать boundary/watermark; догрузить события после границы; не начислять и не списывать по исторической проекции |
| Две версии события | Миграция сохраняет один бизнес-факт; подписчик не применяет v1 и v2 дважды. Нужна таблица соответствия ID при преобразовании |

## 7. Минимальная карточка контракта для команды

До реализации для каждого своего API/EVT владелец заполняет: версию и статус; инициатора/потребителей; маршрут платформы; схему полей/enum/единиц; авторитетную транзакцию; успешный, отклонённый и неизвестный исходы; ключ повторов и срок хранения; порядок и способ восстановления; права и состав чувствительных данных; deadline/нагрузку/SLO; совместимость и тестовые примеры. Команда-потребитель подтверждает свою подписку и обработку дублей. Платформа проверяет доставку, но не утверждает смысл полей за домен.
