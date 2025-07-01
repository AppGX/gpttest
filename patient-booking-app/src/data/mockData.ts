import type { Certificate, Service, ServiceSchedule, QueueInfo, CertificateGroup } from '@/types'

export const certificates: Certificate[] = [
  // Основные справки для Казахстана
  {
    id: 1,
    name: 'Форма 073/у',
    description: 'Поступление в средне-специальные учебные заведения (колледжи, техникумы). Включает анкетные данные, прививки, результаты медосмотров',
    price: 2800,
    requiredServices: [1, 3, 27, 34, 31, 2, 7, 5], // терапевт, офтальмолог, ЛОР, стоматолог, дерматовенеролог, анализы крови, мочи, флюорография
    category: 'certificates',
    icon: '🎓'
  },
  {
    id: 2,
    name: 'Форма 075/у',
    description: 'Поступление в ВУЗы. Более полный объем обследований включая ЭКГ, флюорографию и дополнительные анализы',
    price: 3500,
    requiredServices: [1, 3, 27, 34, 31, 2, 7, 5, 6, 14, 32], // все из 073/у + ЭКГ + гепатиты B,C ВИЧ + анализ на сифилис
    category: 'certificates',
    icon: '🏛️'
  },
  {
    id: 3,
    name: 'Форма 076/у',
    description: 'Трудоустройство на работу. Медосмотр, прививки, анализы включая флюорографию, ВИЧ, RW, гепатиты, кишечные инфекции. Может включать психиатра и нарколога по профессии',
    price: 3200,
    requiredServices: [1, 2, 5, 14, 32, 35], // терапевт, анализы, флюорография, гепатиты ВИЧ, сифилис, кишечные инфекции
    category: 'certificates',
    icon: '💼'
  },
  {
    id: 4,
    name: 'ЛМК (Личная медицинская книжка)',
    description: 'Для работников с санитарно-гигиеническими требованиями (общественное питание, медицина, торговля, детсады, школы). Требует регулярного продления',
    price: 4200,
    requiredServices: [1, 2, 5, 31, 32, 33, 34, 35, 14], // расширенный набор для санитарных требований
    category: 'certificates',
    icon: '📋'
  },
  {
    id: 5,
    name: 'Паспорт здоровья ребенка',
    description: 'Мониторинг здоровья ребенка с рождения до 18 лет. Все прививки по календарю РК, данные развития, диагнозы, скрининги, медосмотры по возрасту',
    price: 2800,
    requiredServices: [29, 2, 3, 6, 7, 36, 37, 30], // педиатр, анализы, офтальмолог, ЭКГ, моча, ортопед, психолог, энтеробиоз
    category: 'certificates',
    icon: '👶'
  },
  
  // Дополнительные справки
  {
    id: 6,
    name: 'Справка для водительских прав',
    description: 'Медицинская справка для получения водительского удостоверения в РК',
    price: 2500,
    requiredServices: [1, 3, 4, 26], // терапевт, офтальмолог, нарколог, невролог
    category: 'certificates',
    icon: '🚗'
  },
  {
    id: 7,
    name: 'Справка для спортивной секции',
    description: 'Медицинская справка для занятий спортом и физкультурой',
    price: 1500,
    requiredServices: [1, 2, 6, 36], // терапевт, анализы, ЭКГ, ортопед
    category: 'certificates',
    icon: '⚽'
  },
  {
    id: 8,
    name: 'Справка для санаторно-курортного лечения',
    description: 'Медицинская справка для получения путевки в санаторий',
    price: 2200,
    requiredServices: [1, 2, 3, 7, 5], // терапевт, анализы крови, офтальмолог, анализ мочи, флюорография
    category: 'certificates',
    icon: '🏥'
  },

  // Прегравидарка (подготовка к беременности)
  {
    id: 9,
    name: 'Прегравидарная подготовка базовая',
    description: 'Базовое обследование при планировании беременности',
    price: 4500,
    requiredServices: [1, 8, 9, 10, 11],
    category: 'preconception',
    icon: '👶'
  },
  {
    id: 10,
    name: 'Прегравидарная подготовка расширенная',
    description: 'Полное обследование при планировании беременности',
    price: 7500,
    requiredServices: [1, 8, 9, 10, 11, 12, 13, 14],
    category: 'preconception',
    icon: '🤰'
  },
  {
    id: 11,
    name: 'Консультация генетика',
    description: 'Генетическое консультирование при планировании беременности',
    price: 3500,
    requiredServices: [15],
    category: 'preconception',
    icon: '🧬'
  },

  // Скрининг (профилактические обследования)
  {
    id: 12,
    name: 'Онкоскрининг базовый',
    description: 'Базовое обследование для раннего выявления онкологии',
    price: 3200,
    requiredServices: [1, 16, 17, 18],
    category: 'screening',
    icon: '🎗️'
  },
  {
    id: 13,
    name: 'Кардиоскрининг',
    description: 'Комплексное обследование сердечно-сосудистой системы',
    price: 2800,
    requiredServices: [1, 6, 19, 20],
    category: 'screening',
    icon: '❤️'
  },
  {
    id: 14,
    name: 'Скрининг диабета',
    description: 'Обследование для выявления сахарного диабета и предиабета',
    price: 2100,
    requiredServices: [21, 22],
    category: 'screening',
    icon: '🩸'
  },
  {
    id: 15,
    name: 'Гормональный скрининг',
    description: 'Комплексное исследование гормонального статуса',
    price: 4200,
    requiredServices: [23, 24, 25],
    category: 'screening',
    icon: '🧪'
  }
]

export const services: Service[] = [
  // Базовые услуги
  {
    id: 1,
    name: 'Терапевт',
    description: 'Осмотр врача-терапевта',
    duration: 30,
    price: 800,
    hasQueue: true,
    supportAppointments: true,
    category: ['certificates', 'preconception', 'screening']
  },
  {
    id: 2,
    name: 'Анализ крови общий',
    description: 'Общий анализ крови',
    duration: 15,
    price: 400,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },
  {
    id: 3,
    name: 'Офтальмолог',
    description: 'Проверка зрения',
    duration: 20,
    price: 600,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 4,
    name: 'Нарколог',
    description: 'Освидетельствование у нарколога',
    duration: 15,
    price: 500,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 5,
    name: 'Флюорография',
    description: 'Рентгенологическое исследование грудной клетки',
    duration: 10,
    price: 300,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },
  {
    id: 6,
    name: 'ЭКГ',
    description: 'Электрокардиография',
    duration: 15,
    price: 350,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates', 'screening']
  },
  {
    id: 7,
    name: 'Анализ мочи',
    description: 'Общий анализ мочи',
    duration: 10,
    price: 250,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },

  // Услуги для прегравидарки
  {
    id: 8,
    name: 'Гинеколог',
    description: 'Консультация врача-гинеколога',
    duration: 30,
    price: 1200,
    hasQueue: false,
    supportAppointments: true,
    category: ['preconception']
  },
  {
    id: 9,
    name: 'УЗИ органов малого таза',
    description: 'Ультразвуковое исследование органов малого таза',
    duration: 25,
    price: 1500,
    hasQueue: false,
    supportAppointments: true,
    category: ['preconception']
  },
  {
    id: 10,
    name: 'Анализ на инфекции TORCH',
    description: 'Анализ на токсоплазмоз, краснуху, цитомегаловирус, герпес',
    duration: 15,
    price: 2200,
    hasQueue: true,
    supportAppointments: false,
    category: ['preconception']
  },
  {
    id: 11,
    name: 'Фолиевая кислота и В12',
    description: 'Анализ уровня фолиевой кислоты и витамина В12',
    duration: 10,
    price: 800,
    hasQueue: true,
    supportAppointments: false,
    category: ['preconception']
  },
  {
    id: 12,
    name: 'Гормоны щитовидной железы',
    description: 'ТТГ, Т3, Т4, антитела к ТПО',
    duration: 15,
    price: 1800,
    hasQueue: true,
    supportAppointments: false,
    category: ['preconception']
  },
  {
    id: 13,
    name: 'Коагулограмма',
    description: 'Исследование системы свертывания крови',
    duration: 15,
    price: 1200,
    hasQueue: true,
    supportAppointments: false,
    category: ['preconception']
  },
  {
    id: 14,
    name: 'Гепатиты B, C и ВИЧ',
    description: 'Анализы на гепатиты B, C и ВИЧ-инфекцию',
    duration: 15,
    price: 1500,
    hasQueue: true,
    supportAppointments: false,
    category: ['preconception']
  },
  {
    id: 15,
    name: 'Врач-генетик',
    description: 'Консультация врача-генетика',
    duration: 45,
    price: 2500,
    hasQueue: false,
    supportAppointments: true,
    category: ['preconception']
  },

  // Услуги для скрининга
  {
    id: 16,
    name: 'Маммография',
    description: 'Рентгенография молочных желез',
    duration: 20,
    price: 1800,
    hasQueue: false,
    supportAppointments: true,
    category: ['screening']
  },
  {
    id: 17,
    name: 'Цитология (мазок Папаниколау)',
    description: 'Цитологическое исследование мазка с шейки матки',
    duration: 15,
    price: 900,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },
  {
    id: 18,
    name: 'Онкомаркеры',
    description: 'Анализ крови на онкомаркеры',
    duration: 15,
    price: 2500,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },
  {
    id: 19,
    name: 'ЭхоКГ (УЗИ сердца)',
    description: 'Эхокардиография - УЗИ сердца',
    duration: 30,
    price: 2200,
    hasQueue: false,
    supportAppointments: true,
    category: ['screening']
  },
  {
    id: 20,
    name: 'Холтер ЭКГ',
    description: 'Суточное мониторирование ЭКГ',
    duration: 20,
    price: 3500,
    hasQueue: false,
    supportAppointments: true,
    category: ['screening']
  },
  {
    id: 21,
    name: 'Глюкоза натощак',
    description: 'Анализ крови на глюкозу натощак',
    duration: 10,
    price: 300,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },
  {
    id: 22,
    name: 'Гликированный гемоглобин',
    description: 'HbA1c - показатель среднего уровня глюкозы за 3 месяца',
    duration: 15,
    price: 800,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },
  {
    id: 23,
    name: 'Гормоны репродуктивной системы',
    description: 'ФСГ, ЛГ, эстрадиол, прогестерон, тестостерон',
    duration: 15,
    price: 2800,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },
  {
    id: 24,
    name: 'Кортизол',
    description: 'Анализ уровня кортизола в крови',
    duration: 10,
    price: 600,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },
  {
    id: 25,
    name: 'Пролактин',
    description: 'Анализ уровня пролактина в крови',
    duration: 10,
    price: 500,
    hasQueue: true,
    supportAppointments: false,
    category: ['screening']
  },

  // Новые услуги для дополнительных справок
  {
    id: 26,
    name: 'Невролог',
    description: 'Консультация врача-невролога',
    duration: 30,
    price: 1000,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 27,
    name: 'Отоларинголог (ЛОР)',
    description: 'Консультация врача-отоларинголога',
    duration: 25,
    price: 800,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 28,
    name: 'Спирометрия',
    description: 'Исследование функции внешнего дыхания',
    duration: 20,
    price: 1200,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 29,
    name: 'Педиатр',
    description: 'Консультация врача-педиатра',
    duration: 30,
    price: 700,
    hasQueue: true,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 30,
    name: 'Анализ на энтеробиоз',
    description: 'Анализ кала на яйца глистов',
    duration: 10,
    price: 300,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },
  {
    id: 31,
    name: 'Дерматовенеролог',
    description: 'Консультация врача-дерматовенеролога',
    duration: 25,
    price: 900,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 32,
    name: 'Анализ на сифилис (RW)',
    description: 'Анализ крови на сифилис (реакция Вассермана)',
    duration: 15,
    price: 600,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },
  {
    id: 33,
    name: 'Бактериологический посев',
    description: 'Бактериологическое исследование мазков из носа и зева',
    duration: 15,
    price: 800,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },
  {
    id: 34,
    name: 'Стоматолог',
    description: 'Консультация врача-стоматолога',
    duration: 25,
    price: 600,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 35,
    name: 'Анализ на кишечные инфекции',
    description: 'Бактериологическое исследование кала на патогенную флору',
    duration: 15,
    price: 900,
    hasQueue: true,
    supportAppointments: false,
    category: ['certificates']
  },
  {
    id: 36,
    name: 'Ортопед',
    description: 'Консультация врача-ортопеда',
    duration: 25,
    price: 800,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 37,
    name: 'Психолог',
    description: 'Консультация детского психолога',
    duration: 40,
    price: 1200,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  },
  {
    id: 38,
    name: 'Психиатр',
    description: 'Консультация врача-психиатра',
    duration: 30,
    price: 1500,
    hasQueue: false,
    supportAppointments: true,
    category: ['certificates']
  }
]

// Группировка справок по категориям
export const getCertificateGroups = (): CertificateGroup[] => {
  const groups: CertificateGroup[] = [
    {
      category: 'certificates',
      title: '📋 Справки',
      description: 'Медицинские справки для различных целей',
      icon: '📋',
      certificates: certificates.filter(cert => cert.category === 'certificates')
    },
    {
      category: 'preconception',
      title: '👶 Прегравидарка',
      description: 'Подготовка к беременности и планирование семьи',
      icon: '👶',
      certificates: certificates.filter(cert => cert.category === 'preconception')
    },
    {
      category: 'screening',
      title: '🔍 Скрининг',
      description: 'Профилактические обследования и диагностика',
      icon: '🔍',
      certificates: certificates.filter(cert => cert.category === 'screening')
    }
  ]
  
  return groups
}

export const timeSlots: string[] = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
]

export const occupiedSlots: string[] = ['10:00', '14:00', '15:30']

// Функция для получения расписания услуги на дату
export const getServiceSchedule = (serviceId: number, date: string): ServiceSchedule => {
  const service = services.find(s => s.id === serviceId)
  if (!service) {
    return { serviceId, date, availableSlots: [] }
  }

  // Имитация разного расписания для разных дней
  const dayOfWeek = new Date(date).getDay()
  let availableSlots: string[] = []
  
  if (service.supportAppointments) {
    // Для услуг с записью по времени - имитируем занятость слотов
    switch (dayOfWeek) {
      case 1: // Понедельник - много свободных слотов
        availableSlots = timeSlots.filter(slot => !['10:00', '14:00'].includes(slot))
        break
      case 2: // Вторник - средняя загруженность
        availableSlots = timeSlots.filter(slot => !['09:30', '10:30', '11:00', '15:00'].includes(slot))
        break
      case 3: // Среда - высокая загруженность
        availableSlots = timeSlots.filter(slot => ['09:00', '12:30', '16:30', '17:30'].includes(slot))
        break
      case 4: // Четверг - все занято (только очередь)
        availableSlots = []
        break
      case 5: // Пятница - несколько слотов
        availableSlots = timeSlots.filter(slot => ['14:00', '14:30', '15:00'].includes(slot))
        break
      default: // Выходные - меньше слотов
        availableSlots = timeSlots.filter(slot => ['10:00', '11:00', '15:00', '16:00'].includes(slot))
    }
  }

  // Информация об очереди для услуг с живой очередью
  let queueInfo: QueueInfo | undefined
  if (service.hasQueue) {
    // Имитация данных очереди
    const queueLength = Math.floor(Math.random() * 15) + 3 // от 3 до 17 человек
    const estimatedWaitTime = queueLength * (service.duration + 5) // время + перерыв
    const nextHour = new Date().getHours() + Math.floor(estimatedWaitTime / 60)
    const nextMinute = Math.floor(estimatedWaitTime % 60)
    
    queueInfo = {
      length: queueLength,
      estimatedWaitTime,
      nextAvailableTime: `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
    }
  }

  return {
    serviceId,
    date,
    availableSlots,
    queueInfo
  }
}

// Функция для получения информации об очереди
export const getQueueInfo = (serviceId: number): QueueInfo => {
  const service = services.find(s => s.id === serviceId)
  if (!service || !service.hasQueue) {
    return { length: 0, estimatedWaitTime: 0 }
  }

  const queueLength = Math.floor(Math.random() * 12) + 5 // от 5 до 16 человек
  const estimatedWaitTime = queueLength * (service.duration + 5)
  const now = new Date()
  const nextTime = new Date(now.getTime() + estimatedWaitTime * 60000)
  
  return {
    length: queueLength,
    estimatedWaitTime,
    nextAvailableTime: `${nextTime.getHours().toString().padStart(2, '0')}:${nextTime.getMinutes().toString().padStart(2, '0')}`
  }
} 