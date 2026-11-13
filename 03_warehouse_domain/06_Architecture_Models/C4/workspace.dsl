workspace "RetailMax — складской домен" "Целевая архитектура BP-03 для центрального склада" {
    model {
        worker = person "Кладовщик" "Принимает товар, комплектует и подтверждает передачу"
        manager = person "Начальник склада" "Утверждает расхождения и результаты инвентаризации"
        erp = softwareSystem "ERP · IS-01" "Товары, закупки и учётные заказы"
        shop = softwareSystem "Интернет-магазин · IS-03" "Заказы канала и обещание доступности"
        bi = softwareSystem "BI · IS-06" "Аналитика по подтверждённым фактам"
        platform = softwareSystem "Интеграционная платформа · IS-07" "Управляемые API, команды и события"

        warehouse = softwareSystem "Warehouse System · BP-03" "Приёмка, складской запас, резерв, исполнение и инвентаризация" {
            terminal = container "Интерфейс WMS" "Работа с поставками, заданиями и пересчётами" "Штатный клиент и ТСД"
            wms = container "Приложение WMS · IS-05" "Подтверждает складские операции и изменения запаса" "Поддерживаемые модули WMS" {
                commands = component "Прикладные интерфейсы" "Проверяют права, формат и идентификаторы команд"
                receiving = component "Приёмка" "Сверяет план поставки и регистрирует физическую приёмку"
                fulfillment = component "Исполнение задания" "Закрепляет резерв, ведёт подбор и подтверждает передачу"
                inventory = component "Инвентаризация" "Фиксирует пересчёт и утверждённую корректировку"
                stock = component "Запас и резерв" "Атомарно применяет движения и проверяет доступность"
                journal = component "Транзакционный журнал" "Сохраняет факты в транзакционной границе WMS"
            }
            wmsdb = container "Хранилище WMS" "Запас, задания, движения, результаты команд и журнал" "Поддерживаемая СУБД" {
                tags "Database"
            }
            adapter = container "Адаптер Warehouse" "Маршрутизирует команды и публикует факты WMS через IS-07" "Контейнерное приложение"
            delivery = container "Состояние адаптера" "Курсоры, попытки доставки и карантин" "Устойчивое хранилище" {
                tags "Database"
            }
        }

        worker -> warehouse "Выполняет складские операции"
        manager -> warehouse "Контролирует задания и утверждает корректировки"
        erp -> platform "Передаёт поставки и задания; читает запас"
        shop -> platform "Запрашивает доступность и резерв"
        platform -> warehouse "Доставляет команды и запросы"
        warehouse -> platform "Возвращает результаты и публикует факты"
        platform -> erp "Передаёт результаты и факты для учёта"
        platform -> shop "Передаёт статусы резерва и исполнения"
        platform -> bi "Передаёт складские факты"

        worker -> terminal "Подтверждает физические операции"
        manager -> terminal "Утверждает результаты"
        terminal -> wms "Вводит операции и читает задания" "Протокол WMS"
        platform -> adapter "Доставляет команды и запросы" "HTTPS / сообщения"
        adapter -> platform "Передаёт ответы и факты" "HTTPS / сообщения"
        adapter -> wms "Вызывает API и читает журнал" "Интерфейс поставщика"
        adapter -> delivery "Хранит состояние доставки"
        wms -> wmsdb "Фиксирует бизнес-данные и журнал"

        terminal -> commands "Запускает действия сотрудника"
        adapter -> commands "Передаёт запросы и команды"
        commands -> receiving "Ведёт план и факт поставки"
        commands -> fulfillment "Ведёт складское задание"
        commands -> inventory "Ведёт пересчёт и утверждение"
        commands -> stock "Читает доступность и подтверждает резерв"
        receiving -> stock "Регистрирует принятое количество"
        fulfillment -> stock "Закрепляет и списывает резерв"
        inventory -> stock "Применяет утверждённое расхождение"
        stock -> wmsdb "Сохраняет движение, версию и результат команды"
        stock -> journal "Регистрирует факт в той же транзакции"
        journal -> wmsdb "Сохраняет записи журнала"
        adapter -> journal "Читает подтверждённые факты"
    }

    views {
        systemContext warehouse "WH-C1" {
            title "C1 · Контекст складского домена"
            include worker manager warehouse platform erp shop bi
            autoLayout tb 150 120
        }
        container warehouse "WH-C2" {
            title "C2 · Контейнеры складского домена"
            include worker manager platform terminal wms wmsdb adapter delivery
            autoLayout tb 135 115
        }
        component wms "WH-C3" {
            title "C3 · Компоненты WMS"
            include terminal adapter commands receiving fulfillment inventory stock journal wmsdb
            autoLayout tb 135 115
        }

        styles {
            element "Element" {
                background #e5edf5
                color #172e47
                stroke #456480
            }
            element "Person" {
                shape Person
                background #173653
                color #ffffff
            }
            element "Software System" {
                background #315f86
                color #ffffff
            }
            element "Database" {
                shape Cylinder
            }
        }
    }
}
