workspace "RetailMax Warehouse 1.3" "CENTRAL/STORE. Проект для согласования 12.11.2026" {
    model {
        worker = person "Складской сотрудник" "Выполняет физические операции"
        storeUser = person "Ответственный магазина" "Физическая приёмка и расхождения"
        pos = softwareSystem "POS" "Первичный чек магазина"
        erp = softwareSystem "ERP и закупки" "Master, учёт, планы пополнения"
        online = softwareSystem "Интернет-магазин" "Заказ канала, оплата"
        bi = softwareSystem "BI" "Читающие проекции"
        wh = softwareSystem "Warehouse System" "Подтверждённый CENTRAL/STORE, резерв и исполнение" {
            ui = container "C1 Интерфейс WMS" "Штатный клиент / ТСД" "Клиент поставщика"
            wms = container "C2 Приложение WMS" "Stock, Reserve, Execution, StoreSync" "Стек поставщика уточняется"
            db = container "C3 БД WMS" "Бизнес-данные, inbox/outbox, аудит" "Поддерживаемая СУБД" {
                tags "Database"
            }
            local = container "C6 Store Inventory" "Локальная служба логистики" "Служба магазина"
            journal = container "C7 Журнал магазина" "Первичные факты, pending и оперативная копия" "Устойчивое локальное хранилище" {
                tags "Database"
            }
        }
        ip = softwareSystem "IS-07" "Одна корпоративная платформа интеграции" {
            gateway = container "Gateway и транспорт" "Маршрутизация и устойчивый обмен" "Продукты согласуются"
            adapter = container "C4 Warehouse Adapter" "Преобразование и доставка" "Контейнерное приложение"
            state = container "C5 Техническое состояние" "Курсоры и доставка, без Stock" "Устойчивое хранилище" {
                tags "Database"
            }
        }
        worker -> ui "Подтверждает физические операции"
        storeUser -> local "Приёмка, возврат и расхождения"
        ui -> wms "Штатный протокол" "Защищённый протокол поставщика"
        wms -> db "Локальная транзакция" "Поддерживаемый доступ"
        pos -> local "Факт saleId/lineId" "Локальный интерфейс"
        local -> journal "Операция и outbox атомарно" "Локальная транзакция"
        local -> gateway "WH API-16/17 и чтение снимка" "HTTPS через IS-07"
        gateway -> local "INT EVT-25/27 и результат" "Разрешённая подписка"
        gateway -> adapter "API и команды" "Внутри IS-07"
        adapter -> gateway "События и результаты" "Внутри IS-07"
        adapter -> wms "Поддерживаемый API/журнал" "HTTPS / журнал поставщика"
        adapter -> state "Курсоры и доставка" "Техническое хранение"
        erp -> gateway "Товар, задание, transfer и запрос остатков" "API/команды"
        gateway -> erp "Ответ WMS без сохранения копии; факты исполнения" "API/события"
        online -> gateway "Reserve, confirm-paid, статус" "API"
        gateway -> bi "Факты и снимки" "События"
    }
    views {
        systemContext wh "WHContext" {
            include *
            autoLayout lr
        }
        container wh "WHContainers" {
            include *
            autoLayout lr
        }
        styles {
            element "Person" {
                shape Person
                background #17365d
                color #ffffff
            }
            element "Software System" {
                background #305b85
                color #ffffff
            }
            element "Container" {
                background #e4edf6
                color #172b44
            }
            element "Database" {
                shape Cylinder
            }
        }
    }
}
