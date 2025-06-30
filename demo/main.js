const { createApp } = Vue;

const certificates = [
  {
    id: 1,
    name: 'Справка для школы',
    services: [
      { id: 1, name: 'Осмотр терапевта' },
      { id: 2, name: 'Осмотр окулиста' }
    ]
  },
  {
    id: 2,
    name: 'Справка для бассейна',
    services: [
      { id: 3, name: 'Осмотр дерматолога' },
      { id: 4, name: 'Осмотр терапевта' }
    ]
  },
  {
    id: 3,
    name: 'Справка на оружие',
    services: [
      { id: 5, name: 'Осмотр психиатра' },
      { id: 6, name: 'Осмотр нарколога' }
    ]
  }
];

createApp({
  data() {
    return {
      certificates,
      selectedCertificate: '',
      services: [],
      selectedService: null,
      mode: 'booking',
      bookingDate: '',
      bookingTime: ''
    };
  },
  methods: {
    selectCertificate() {
      this.services = this.selectedCertificate ? this.selectedCertificate.services : [];
      this.selectedService = null;
      this.mode = 'booking';
      this.bookingDate = '';
      this.bookingTime = '';
    },
    selectService(service) {
      this.selectedService = service;
      this.mode = 'booking';
      this.bookingDate = '';
      this.bookingTime = '';
    }
  }
}).mount('#app');
