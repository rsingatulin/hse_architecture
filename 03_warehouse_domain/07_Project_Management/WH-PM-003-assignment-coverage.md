# Покрытие заданий DOC-01–DOC-09

| Поле | Значение |
| --- | --- |
| Идентификатор / версия | WH-PM-003 / 1.0 |
| Дата | 04.10.2026 |
| Ответственная группа | Команда 3 — Warehouse |
| Статус | Проект для согласования; не свидетельствует о внедрении |
| Источники | [DOC-01](../../00_Documentation/DOC-01.md), [DOC-02](../../00_Documentation/DOC-02.md), [DOC-03](../../00_Documentation/DOC-03.md), [DOC-04](../../00_Documentation/DOC-04.md), [DOC-05](../../00_Documentation/DOC-05.md), [DOC-06](../../00_Documentation/DOC-06.md), [DOC-07](../../00_Documentation/DOC-07.md), [DOC-08](../../00_Documentation/DOC-08.md), [DOC-09](../../00_Documentation/DOC-09.md) |
| Связанные требования | WH-R-01–20 — [каталог](../01_Business_Architecture/Requirements/WH-REQ-001-requirements.md) |

## Объём и статус

Проверены **61 пункт** в разделах заданий DOC-01–DOC-09 включительно. Задания выполнены в границах Warehouse; общие системы и соседние домены показаны только для контекста и согласования интерфейсов. Кроме нумерованных пунктов учтены перечни результатов DOC-08/09: сервисы, ADR, BPMN, ArchiMate, C4, UML Component, технологии, ИИ, ТЭО, риски и дорожная карта.

«Подготовлен документальный результат» означает наличие содержательного проекта артефакта, а не его утверждение, внедрение или успешное испытание. Ниже не ставится фиктивная отметка о состоявшейся устной защите либо подтверждении требований другими командами.

## DOC-01

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 01.1 | Выполнить анализ предметной области | [Обследование / содержание](../README.md); [Архитектурное видение и бизнес-возможности Warehouse](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md) | Подготовлен документальный результат |
| 01.2 | Определить заинтересованные стороны | [Реестр и карта участников](../01_Business_Architecture/Stakeholders/WH-STK-001-stakeholders.md) | Подготовлен документальный результат |
| 01.3 | Смоделировать бизнес-процессы | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md); [BPMN: процесс Warehouse As-Is](../06_Architecture_Models/BPMN/WH-BPMN-001-as-is.md); [BPMN: целевые процессы Warehouse](../06_Architecture_Models/BPMN/WH-BPMN-002-to-be.md) | Подготовлен документальный результат |
| 01.4 | Построить архитектурные модели предприятия | [ArchiMate: связанные бизнес-, прикладной и технологический слои](../06_Architecture_Models/ArchiMate/WH-AM-001-layered-model.md); [C4: контекст складской информационной системы](../06_Architecture_Models/C4/WH-C4-001-context.md); [C4: контейнеры Warehouse System и взаимодействие сервисов](../06_Architecture_Models/C4/WH-C4-002-containers.md); [UML Component: складское приложение и адаптер](../06_Architecture_Models/UML/WH-UML-001-components.md) | Подготовлен документальный результат |
| 01.5 | Спроектировать архитектуру приложений | [Карта приложений и границы ответственности](../02_Application_Architecture/Application_Catalog/WH-APP-001-landscape.md); [Каталог сервисов Warehouse](../02_Application_Architecture/Services/WH-SRV-001-services.md); [Интеграционная архитектура As-Is и To-Be](../02_Application_Architecture/Integrations/WH-INT-001-integration.md); [Каталог API и событий Warehouse](../02_Application_Architecture/APIs/WH-API-001-catalog.md) | Подготовлен документальный результат |
| 01.6 | Спроектировать технологическую архитектуру | [Технологическая архитектура Warehouse As-Is](../04_Technology_Architecture/Infrastructure/WH-TECH-001-as-is.md); [Технологическая архитектура To-Be и концепция Kubernetes](../04_Technology_Architecture/Deployment/WH-TECH-002-to-be.md) | Подготовлен документальный результат |
| 01.7 | Предложить варианты использования технологий искусственного интеллекта | [Варианты применения ИИ в Warehouse](../02_Application_Architecture/Services/WH-AI-001-ai-options.md) | Подготовлен документальный результат |
| 01.8 | Выполнить технико-экономическое обоснование | [Предварительное ТЭО Warehouse: TCO, эффект и чувствительность](TCO_ROI/WH-ECO-001-business-case.md) | Подготовлен документальный результат |
| 01.9 | Подготовить план внедрения | [Дорожная карта будущего внедрения Warehouse](Roadmap/WH-ROAD-001-roadmap.md) | Подготовлен документальный результат |
| 01.10 | Защитить разработанный архитектурный проект | [Материалы для защиты архитектурного проекта Warehouse](WH-PM-004-defense.md) | Материалы готовы; устная защита требует участия команды |

## DOC-02

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 02.1 | Определить заинтересованные стороны (Stakeholders) | [Реестр и карта участников](../01_Business_Architecture/Stakeholders/WH-STK-001-stakeholders.md) | Подготовлен документальный результат |
| 02.2 | Построить карту заинтересованных сторон | [Реестр и карта участников](../01_Business_Architecture/Stakeholders/WH-STK-001-stakeholders.md) | Подготовлен документальный результат |
| 02.3 | Определить цели основных участников проекта | [Реестр и карта участников](../01_Business_Architecture/Stakeholders/WH-STK-001-stakeholders.md); [Архитектурное видение и бизнес-возможности Warehouse](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md) | Подготовлен документальный результат |
| 02.4 | Подготовить перечень архитектурных требований для выбранного бизнес-процесса | [Каталог требований](../01_Business_Architecture/Requirements/WH-REQ-001-requirements.md) | Подготовлен документальный результат |
| 02.5 | Определить участников моделируемого бизнес-процесса | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md); [BPMN: процесс Warehouse As-Is](../06_Architecture_Models/BPMN/WH-BPMN-001-as-is.md) | Подготовлен документальный результат |

## DOC-03

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 03.1 | Определить границы бизнес-процесса | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md) | Подготовлен документальный результат |
| 03.2 | Выделить участников процесса | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md) | Подготовлен документальный результат |
| 03.3 | Определить входы и выходы процесса | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md) | Подготовлен документальный результат |
| 03.4 | Определить основные события | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md) | Подготовлен документальный результат |
| 03.5 | Выявить проблемы текущего процесса | [Реестр проблем](../01_Business_Architecture/Requirements/WH-PRB-001-problems.md) | Подготовлен документальный результат |
| 03.6 | Построить BPMN-модель процесса As-Is | [BPMN: процесс Warehouse As-Is](../06_Architecture_Models/BPMN/WH-BPMN-001-as-is.md) | Подготовлен документальный результат |
| 03.7 | Подготовить предложения по совершенствованию процесса и разработать модель To-Be | [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md); [BPMN: целевые процессы Warehouse](../06_Architecture_Models/BPMN/WH-BPMN-002-to-be.md) | Подготовлен документальный результат |

## DOC-04

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 04.1 | Построить карту приложений предприятия (Application Landscape) | [Карта приложений и границы ответственности](../02_Application_Architecture/Application_Catalog/WH-APP-001-landscape.md) | Подготовлен документальный результат |
| 04.2 | Определить владельцев информационных систем | [Карта приложений и границы ответственности](../02_Application_Architecture/Application_Catalog/WH-APP-001-landscape.md) | Подготовлен документальный результат |
| 04.3 | Выделить основные функции каждой системы | [Карта приложений и границы ответственности](../02_Application_Architecture/Application_Catalog/WH-APP-001-landscape.md) | Подготовлен документальный результат |
| 04.4 | Определить границы ответственности информационных систем | [Карта приложений и границы ответственности](../02_Application_Architecture/Application_Catalog/WH-APP-001-landscape.md); [Каталог сервисов Warehouse](../02_Application_Architecture/Services/WH-SRV-001-services.md) | Подготовлен документальный результат |
| 04.5 | Построить модель Application Layer в ArchiMate | [ArchiMate: связанные бизнес-, прикладной и технологический слои](../06_Architecture_Models/ArchiMate/WH-AM-001-layered-model.md) | Подготовлен документальный результат |
| 04.6 | Подготовить диаграмму C4 Context для выбранного бизнес-процесса | [C4: контекст складской информационной системы](../06_Architecture_Models/C4/WH-C4-001-context.md) | Подготовлен документальный результат |
| 04.7 | Предложить варианты модернизации архитектуры приложений | [Карта приложений и границы ответственности](../02_Application_Architecture/Application_Catalog/WH-APP-001-landscape.md); [ADR-WH-001: единый источник остатка и резервирование](../05_Architecture_Decisions/ADR/ADR-WH-001-inventory-authority.md); [ADR-WH-002: управляемые API и восстановимая доставка событий](../05_Architecture_Decisions/ADR/ADR-WH-002-integration.md); [ADR-WH-003: поэтапное контейнерное размещение новых компонентов](../05_Architecture_Decisions/ADR/ADR-WH-003-deployment.md) | Подготовлен документальный результат |

## DOC-05

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 05.1 | Построить диаграмму интеграции приложений As-Is | [Интеграционная архитектура As-Is и To-Be](../02_Application_Architecture/Integrations/WH-INT-001-integration.md) | Подготовлен документальный результат |
| 05.2 | Выделить владельцев данных | [Владельцы данных, качество и устранение дублирования](../03_Data_Architecture/Data_Ownership/WH-DGO-001-ownership.md) | Подготовлен документальный результат |
| 05.3 | Определить источники и потребителей информации | [Интеграционная архитектура As-Is и To-Be](../02_Application_Architecture/Integrations/WH-INT-001-integration.md); [Потоки данных и правила межсистемного обмена](../03_Data_Architecture/Data_Flows/WH-DF-001-flows.md) | Подготовлен документальный результат |
| 05.4 | Выявить архитектурные недостатки текущей интеграции | [Интеграционная архитектура As-Is и To-Be](../02_Application_Architecture/Integrations/WH-INT-001-integration.md); [Реестр проблем](../01_Business_Architecture/Requirements/WH-PRB-001-problems.md) | Подготовлен документальный результат |
| 05.5 | Предложить целевую архитектуру взаимодействия приложений | [Интеграционная архитектура As-Is и To-Be](../02_Application_Architecture/Integrations/WH-INT-001-integration.md); [ADR-WH-002: управляемые API и восстановимая доставка событий](../05_Architecture_Decisions/ADR/ADR-WH-002-integration.md) | Подготовлен документальный результат |
| 05.6 | Разработать каталог API для выбранного бизнес-процесса | [Каталог API и событий Warehouse](../02_Application_Architecture/APIs/WH-API-001-catalog.md) | Подготовлен документальный результат |
| 05.7 | Подготовить модель взаимодействия сервисов (C4 Container или UML Component) | [C4: контейнеры Warehouse System и взаимодействие сервисов](../06_Architecture_Models/C4/WH-C4-002-containers.md); [UML Component: складское приложение и адаптер](../06_Architecture_Models/UML/WH-UML-001-components.md) | Подготовлен документальный результат |

## DOC-06

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 06.1 | Определить основные бизнес-сущности выбранного процесса | [Концептуальная и целевая модель данных Warehouse](../03_Data_Architecture/Data_Entities/WH-DAT-001-data-model.md) | Подготовлен документальный результат |
| 06.2 | Построить концептуальную модель данных | [Концептуальная и целевая модель данных Warehouse](../03_Data_Architecture/Data_Entities/WH-DAT-001-data-model.md) | Подготовлен документальный результат |
| 06.3 | Определить владельцев данных и ответственных за их качество | [Владельцы данных, качество и устранение дублирования](../03_Data_Architecture/Data_Ownership/WH-DGO-001-ownership.md) | Подготовлен документальный результат |
| 06.4 | Выделить данные, используемые несколькими информационными системами | [Владельцы данных, качество и устранение дублирования](../03_Data_Architecture/Data_Ownership/WH-DGO-001-ownership.md); [Потоки данных и правила межсистемного обмена](../03_Data_Architecture/Data_Flows/WH-DF-001-flows.md) | Подготовлен документальный результат |
| 06.5 | Предложить меры по устранению дублирования данных | [Владельцы данных, качество и устранение дублирования](../03_Data_Architecture/Data_Ownership/WH-DGO-001-ownership.md) | Подготовлен документальный результат |
| 06.6 | Разработать модель данных для целевой архитектуры | [Концептуальная и целевая модель данных Warehouse](../03_Data_Architecture/Data_Entities/WH-DAT-001-data-model.md) | Подготовлен документальный результат |
| 06.7 | Определить требования к обмену данными между информационными системами | [Потоки данных и правила межсистемного обмена](../03_Data_Architecture/Data_Flows/WH-DF-001-flows.md); [Каталог API и событий Warehouse](../02_Application_Architecture/APIs/WH-API-001-catalog.md) | Подготовлен документальный результат |

## DOC-07

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 07.1 | Построить модель технологической архитектуры As-Is | [Технологическая архитектура Warehouse As-Is](../04_Technology_Architecture/Infrastructure/WH-TECH-001-as-is.md) | Подготовлен документальный результат |
| 07.2 | Определить основные компоненты инфраструктуры | [Технологическая архитектура Warehouse As-Is](../04_Technology_Architecture/Infrastructure/WH-TECH-001-as-is.md) | Подготовлен документальный результат |
| 07.3 | Выявить архитектурные недостатки существующей инфраструктуры | [Технологическая архитектура Warehouse As-Is](../04_Technology_Architecture/Infrastructure/WH-TECH-001-as-is.md); [Реестр проблем](../01_Business_Architecture/Requirements/WH-PRB-001-problems.md) | Подготовлен документальный результат |
| 07.4 | Предложить целевую схему развертывания приложений | [Технологическая архитектура To-Be и концепция Kubernetes](../04_Technology_Architecture/Deployment/WH-TECH-002-to-be.md) | Подготовлен документальный результат |
| 07.5 | Определить, какие компоненты целесообразно контейнеризировать | [Технологическая архитектура To-Be и концепция Kubernetes](../04_Technology_Architecture/Deployment/WH-TECH-002-to-be.md) | Подготовлен документальный результат |
| 07.6 | Разработать концепцию Kubernetes-кластера для размещения корпоративных сервисов | [Технологическая архитектура To-Be и концепция Kubernetes](../04_Technology_Architecture/Deployment/WH-TECH-002-to-be.md); [ADR-WH-003: поэтапное контейнерное размещение новых компонентов](../05_Architecture_Decisions/ADR/ADR-WH-003-deployment.md) | Подготовлен документальный результат |
| 07.7 | Подготовить описание технологической архитектуры To-Be | [Технологическая архитектура To-Be и концепция Kubernetes](../04_Technology_Architecture/Deployment/WH-TECH-002-to-be.md); [Наблюдаемость, восстановление и приёмочные сценарии](../04_Technology_Architecture/Monitoring/WH-OPS-001-operations.md); [Безопасность складского контура](../04_Technology_Architecture/Security/WH-SEC-001-security.md) | Подготовлен документальный результат |

## DOC-08

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 08.1 | Определить архитектурные цели для выбранного бизнес-процесса | [Архитектурное видение и бизнес-возможности Warehouse](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md) | Подготовлен документальный результат |
| 08.2 | Сформулировать архитектурные требования | [Каталог требований](../01_Business_Architecture/Requirements/WH-REQ-001-requirements.md) | Подготовлен документальный результат |
| 08.3 | Подготовить перечень архитектурных принципов, применимых к проекту | [Архитектурное видение и бизнес-возможности Warehouse](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md) | Подготовлен документальный результат |
| 08.4 | Предложить направления использования искусственного интеллекта | [Варианты применения ИИ в Warehouse](../02_Application_Architecture/Services/WH-AI-001-ai-options.md) | Подготовлен документальный результат |
| 08.5 | Определить критерии успешности проекта | [Архитектурное видение и бизнес-возможности Warehouse](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md); [Наблюдаемость, восстановление и приёмочные сценарии](../04_Technology_Architecture/Monitoring/WH-OPS-001-operations.md) | Подготовлен документальный результат |
| 08.6 | Проверить соответствие проектируемой архитектуры стратегическим целям компании | [Архитектурное видение и бизнес-возможности Warehouse](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md) | Подготовлен документальный результат |

## DOC-09

| Пункт | Задание | Результат | Статус |
| --- | --- | --- | --- |
| 09.1 | Определить область ответственности своей проектной группы | [Паспорт и план выполнения архитектурного проекта Warehouse](WH-PM-001-project-plan.md); [Паспорт процесса BP-03 и предложения по совершенствованию](../01_Business_Architecture/Business_Process/WH-BP-001-process.md) | Подготовлен документальный результат |
| 09.2 | Подготовить план выполнения архитектурного проекта | [Паспорт и план выполнения архитектурного проекта Warehouse](WH-PM-001-project-plan.md) | Подготовлен документальный результат |
| 09.3 | Определить состав создаваемых архитектурных артефактов | [Паспорт и план выполнения архитектурного проекта Warehouse](WH-PM-001-project-plan.md); [Обследование / содержание](../README.md) | Подготовлен документальный результат |
| 09.4 | Организовать совместную работу в архитектурном репозитории | [Паспорт и план выполнения архитектурного проекта Warehouse](WH-PM-001-project-plan.md); [Междоменные соглашения и проверка согласованности](WH-PM-002-coordination.md) | Структура и правила подготовлены; персональные назначения — командой |
| 09.5 | Обеспечить согласованность разрабатываемых решений с результатами других групп | [Междоменные соглашения и проверка согласованности](WH-PM-002-coordination.md) | Выполнена сверка опубликованных материалов; подтверждения сторон ожидаются |

## Дополнительная трассировка требований в созданные артефакты

| Требования | Основной результат |
| --- | --- |
| WH-R-01/03 | [Данные](../03_Data_Architecture/Data_Entities/WH-DAT-001-data-model.md), [владение](../03_Data_Architecture/Data_Ownership/WH-DGO-001-ownership.md), [ADR-001](../05_Architecture_Decisions/ADR/ADR-WH-001-inventory-authority.md) |
| WH-R-02/09 | [Интеграции](../02_Application_Architecture/Integrations/WH-INT-001-integration.md), [API](../02_Application_Architecture/APIs/WH-API-001-catalog.md), [ADR-002](../05_Architecture_Decisions/ADR/ADR-WH-002-integration.md) |
| WH-R-04/05/06 | [BP-03](../01_Business_Architecture/Business_Process/WH-BP-001-process.md), [BPMN To-Be](../06_Architecture_Models/BPMN/WH-BPMN-002-to-be.md), [сервисы](../02_Application_Architecture/Services/WH-SRV-001-services.md) |
| WH-R-07/08/13 | [Цели](../01_Business_Architecture/Business_Capabilities/WH-VIS-001-vision.md), [измерения и сценарии](../04_Technology_Architecture/Monitoring/WH-OPS-001-operations.md), [потоки](../03_Data_Architecture/Data_Flows/WH-DF-001-flows.md) |
| WH-R-10/11/12 | [Технологии To-Be](../04_Technology_Architecture/Deployment/WH-TECH-002-to-be.md), [восстановление](../04_Technology_Architecture/Monitoring/WH-OPS-001-operations.md) |
| WH-R-14/19 | [Безопасность](../04_Technology_Architecture/Security/WH-SEC-001-security.md), [API](../02_Application_Architecture/APIs/WH-API-001-catalog.md) |
| WH-R-15 | [Наблюдаемость](../04_Technology_Architecture/Monitoring/WH-OPS-001-operations.md) |
| WH-R-16 | [Дорожная карта](Roadmap/WH-ROAD-001-roadmap.md), [риски](Risks/WH-RSK-001-risks.md) |
| WH-R-17/18 | [Работа в репозитории](WH-PM-001-project-plan.md), [междоменные соглашения](WH-PM-002-coordination.md), [ADR-003](../05_Architecture_Decisions/ADR/ADR-WH-003-deployment.md) |
| WH-R-20 | [Варианты ИИ](../02_Application_Architecture/Services/WH-AI-001-ai-options.md) |

## Ограничения результатов

Входные противоречия WH-Q-01–08 сохранены в [обследовании](../README.md); они не скрыты произвольным выбором удобных цифр. Модели As-Is используют подтверждённый поток DOC-01–09; детали To-Be являются предложениями. Экономические и инфраструктурные допущения обозначены. Подробный текущий регламент инвентаризации не предоставлен; разработана целевая модель. Чужие каталоги и общая документация не входят в область изменений.

[К содержанию Warehouse](../README.md)
