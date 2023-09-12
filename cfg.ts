import { Iconfig } from "./interfaces/iconfig";

export const config: Iconfig = {

    /* Ощиие настройки */
    minGasPrice: 100, //Минимальный газ при котором софт начнет работу в GWEI прим. 100 = 100gwei
    sleep: [1, 1], //Задержка между аккаунтами и протоколами. Случайное число [ОТ, ДО]
    
    /* Создание кошельков */
    batch_create: false,
    batch_create_number: 30, //Количество созданных кошельков

    /* Бридж ETH через официальный мост */ 
    starkgate: false,
    starkgate_show_fee: false, // Если true покажет сколько потребуется ETH для установленного starkgate_amount. БРИДЖ НЕ ПРОИЗОЙДЕТ
    starkgate_amount: "0.0077",

    /* Обновдение кошельков до актуальной версии имплементации */
    upgrade: false,

    /* Предоставление ликвидности в jediSwap */
    jediSwap_liq: false,
    jediSwap_liq_amount: [1, 1], //Выбирает случайно количество стейблов для предоставления ликвидности [ОТ, ДО]
    
    /*
        dex - рандомизирует количество dex протоколов
        если указано [4, 4] будут взяты все ВКЛЮЧЕННЫЕ протоколы
        если указано [1, 2] или [1, 4] будет взято случайное число протоколов от 1 до 2 или от 1 до 3 соотвественно 
    */
    protocols: [1, 3], //DEV пока не реализовано
    jediSwap: true,
    l0kswap: true,
    mySwap: false,

    slippage: 1, //Проскальзывание в процентах 1 = 1%

    stableSwap: true, //Если включено обменивает ТОЛЬКО стейблы иначе обменивает ETH на стейбл
    stableSwap_full_balance: true, //Если включено обменивает весь доступный баланс стейблов
    stable_amount_to_swap: [1, 10], //Выбирает случайно количество стейблов для свапа [ОТ, ДО]

    /* Письма Dmail */
    dmail: true, 
    Dmail_mails_count: 2,
}