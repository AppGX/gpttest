const { createApp } = Vue;

createApp({
    data() {
        return {
            currentStep: 1,
            selectedCertificate: null,
            selectedService: null,
            bookingType: null, // 'appointment' или 'queue'
            selectedDate: null,
            selectedTime: null,
            queueLength: 8,
            
            // Справки
            certificates: [
                {
                    id: 1,
                    name: 'Справка для водительских прав',
                    description: 'Медицинская справка для получения водительского удостоверения',
                    price: 2500,
                    requiredServices: [1, 2, 3, 4]
                },
                {
                    id: 2,
                    name: 'Справка для работы',
                    description: 'Медицинская справка для трудоустройства',
                    price: 1500,
                    requiredServices: [1, 2, 5]
                },
                {
                    id: 3,
                    name: 'Справка для спортивной секции',
                    description: 'Медицинская справка для занятий спортом',
                    price: 1200,
                    requiredServices: [1, 2, 6]
                },
                {
                    id: 4,
                    name: 'Справка для учебы',
                    description: 'Медицинская справка для поступления в учебное заведение',
                    price: 1000,
                    requiredServices: [1, 2]
                },
                {
                    id: 5,
                    name: 'Справка для путевки',
                    description: 'Медицинская справка для санаторно-курортного лечения',
                    price: 1800,
                    requiredServices: [1, 2, 3, 7]
                }
            ],
            
            // Услуги
            services: [
                {
                    id: 1,
                    name: 'Терапевт',
                    description: 'Осмотр врача-терапевта',
                    duration: 30,
                    price: 800,
                    hasQueue: true
                },
                {
                    id: 2,
                    name: 'Анализ крови',
                    description: 'Общий анализ крови',
                    duration: 15,
                    price: 400,
                    hasQueue: true
                },
                {
                    id: 3,
                    name: 'Офтальмолог',
                    description: 'Проверка зрения',
                    duration: 20,
                    price: 600,
                    hasQueue: false
                },
                {
                    id: 4,
                    name: 'Нарколог',
                    description: 'Освидетельствование у нарколога',
                    duration: 15,
                    price: 500,
                    hasQueue: false
                },
                {
                    id: 5,
                    name: 'Флюорография',
                    description: 'Рентгенологическое исследование грудной клетки',
                    duration: 10,
                    price: 300,
                    hasQueue: true
                },
                {
                    id: 6,
                    name: 'ЭКГ',
                    description: 'Электрокардиография',
                    duration: 15,
                    price: 350,
                    hasQueue: false
                },
                {
                    id: 7,
                    name: 'Анализ мочи',
                    description: 'Общий анализ мочи',
                    duration: 10,
                    price: 250,
                    hasQueue: true
                }
            ],
            
            // Доступные временные слоты
            timeSlots: [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
                '16:00', '16:30', '17:00', '17:30'
            ]
        }
    },
    
    computed: {
        availableServices() {
            if (!this.selectedCertificate) return [];
            return this.services.filter(service => 
                this.selectedCertificate.requiredServices.includes(service.id)
            );
        },
        
        today() {
            return new Date().toISOString().split('T')[0];
        },
        
        availableTimeSlots() {
            // Имитация занятых слотов
            const occupiedSlots = ['10:00', '14:00', '15:30'];
            return this.timeSlots.filter(slot => !occupiedSlots.includes(slot));
        },
        
        estimatedWaitTime() {
            return this.queueLength * 15; // 15 минут на человека
        },
        
        canProceed() {
            if (this.bookingType === 'appointment') {
                return this.selectedDate && this.selectedTime;
            }
            return this.bookingType === 'queue';
        },
        
        formattedDateTime() {
            if (!this.selectedDate || !this.selectedTime) return '';
            const date = new Date(this.selectedDate);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            };
            return `${date.toLocaleDateString('ru-RU', options)} в ${this.selectedTime}`;
        },
        
        totalCost() {
            let total = 0;
            if (this.selectedCertificate) {
                total += this.selectedCertificate.price;
            }
            if (this.selectedService) {
                total += this.selectedService.price;
            }
            return total;
        }
    },
    
    methods: {
        selectCertificate(certificate) {
            this.selectedCertificate = certificate;
            // Сброс выбранной услуги при смене справки
            this.selectedService = null;
        },
        
        selectService(service) {
            this.selectedService = service;
            // Сброс параметров записи при смене услуги
            this.bookingType = null;
            this.selectedDate = null;
            this.selectedTime = null;
        },
        
        nextStep() {
            if (this.currentStep < 4) {
                this.currentStep++;
            }
        },
        
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
        },
        
        confirmBooking() {
            // Имитация отправки данных на сервер
            console.log('Booking confirmed:', {
                certificate: this.selectedCertificate,
                service: this.selectedService,
                bookingType: this.bookingType,
                date: this.selectedDate,
                time: this.selectedTime
            });
            
            // Переход к подтверждению
            this.nextStep();
            
            // Если это живая очередь, добавляем в очередь
            if (this.bookingType === 'queue') {
                this.queueLength++;
            }
        },
        
        resetForm() {
            this.currentStep = 1;
            this.selectedCertificate = null;
            this.selectedService = null;
            this.bookingType = null;
            this.selectedDate = null;
            this.selectedTime = null;
        },
        
        printBooking() {
            // Имитация печати талона
            const bookingDetails = {
                certificate: this.selectedCertificate.name,
                service: this.selectedService.name,
                bookingType: this.bookingType,
                date: this.selectedDate,
                time: this.selectedTime,
                totalCost: this.totalCost
            };
            
            console.log('Printing booking details:', bookingDetails);
            
            // Создание талона для печати
            const printContent = `
                ТАЛОН ЗАПИСИ
                ============
                Справка: ${this.selectedCertificate.name}
                Услуга: ${this.selectedService.name}
                ${this.bookingType === 'appointment' ? 
                    `Дата и время: ${this.formattedDateTime}` : 
                    'Тип записи: Живая очередь'
                }
                Стоимость: ${this.totalCost} руб.
                ============
                Дата выдачи: ${new Date().toLocaleString('ru-RU')}
            `;
            
            alert('Талон готов к печати!\n\n' + printContent);
        }
    },
    
    mounted() {
        // Инициализация при загрузке приложения
        console.log('Vue app mounted');
        
        // Имитация обновления очереди каждые 30 секунд
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.queueLength = Math.max(0, this.queueLength - 1);
            }
        }, 30000);
    }
}).mount('#app'); 