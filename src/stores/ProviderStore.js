export default {
  namespaced: true,
  state: {
    availableJobs: [
      {
        id: 101,
        title: 'Move-out cleaning',
        client: 'Lerato M.',
        date: '2026-09-21',
        time: '09:00 - 12:00',
        location: 'Observatory, Cape Town',
        description: 'Deep clean a two-bedroom student apartment before handover.',
        duration: '3 hours',
        pay: 650,
        requirements: 'Cleaning supplies and transport'
      },
      {
        id: 102,
        title: 'Flat-pack furniture assembly',
        client: 'Thabo N.',
        date: '2026-09-23',
        time: '14:00 - 16:00',
        location: 'Rondebosch, Cape Town',
        description: 'Assemble a desk, bookshelf, and bedside table in a student residence.',
        duration: '2 hours',
        pay: 450,
        requirements: 'Basic hand tools'
      },
      {
        id: 103,
        title: 'Laptop software setup',
        client: 'Aisha K.',
        date: '2026-09-25',
        time: '10:30 - 12:00',
        location: 'Wynberg, Cape Town',
        description: 'Install required course software and help configure a new laptop.',
        duration: '1.5 hours',
        pay: 500,
        requirements: 'Windows and macOS experience'
      }
    ],
    acceptedJobs: [
      {
        id: 201,
        title: 'Plumbing repair',
        client: 'Mia D.',
        date: '2026-09-18',
        time: '13:00 - 15:00',
        location: 'Claremont, Cape Town',
        description: 'Repair a leaking kitchen tap and inspect the under-sink connection.',
        duration: '2 hours',
        pay: 800,
        status: 'scheduled'
      },
      {
        id: 202,
        title: 'Residence room painting',
        client: 'Campus Living',
        date: '2026-09-28',
        time: '08:00 - 13:00',
        location: 'Mowbray, Cape Town',
        description: 'Refresh one residence room and leave the space ready for inspection.',
        duration: '5 hours',
        pay: 1250,
        status: 'upcoming'
      }
    ],
    completedJobs: [
      {
        id: 301,
        title: 'Emergency lock replacement',
        client: 'Sipho D.',
        date: '2026-09-10',
        time: '16:00 - 17:30',
        location: 'Maitland, Cape Town',
        description: 'Replaced a damaged front-door lock and supplied two spare keys.',
        duration: '1.5 hours',
        pay: 550,
        status: 'completed'
      },
      {
        id: 302,
        title: 'Student move assistance',
        client: 'Naledi S.',
        date: '2026-09-06',
        time: '09:00 - 12:00',
        location: 'Salt River, Cape Town',
        description: 'Helped move boxed belongings from a residence to a nearby storage unit.',
        duration: '3 hours',
        pay: 700,
        status: 'completed'
      }
    ],
    reviews: [
      { id: 1, client: 'Sipho D.', job: 'Emergency lock replacement', rating: 5, comment: 'Arrived early and solved the problem quickly.', date: '2026-09-11' },
      { id: 2, client: 'Naledi S.', job: 'Student move assistance', rating: 4, comment: 'Professional and careful with every box.', date: '2026-09-07' },
      { id: 3, client: 'Mia D.', job: 'Plumbing repair', rating: 5, comment: 'Clear communication and excellent work.', date: '2026-08-29' }
    ]
  },
  getters: {
    availableJobs: state => state.availableJobs,
    acceptedJobs: state => state.acceptedJobs,
    completedJobs: state => state.completedJobs,
    reviews: state => state.reviews,
    totalEarnings: state => [...state.acceptedJobs, ...state.completedJobs].reduce((sum, job) => sum + job.pay, 0),
    scheduledJobs: state => state.acceptedJobs.filter(job => job.status === 'scheduled'),
    upcomingJobs: state => state.acceptedJobs.filter(job => job.status === 'upcoming')
  },
  mutations: {
    acceptJob(state, jobId) {
      const index = state.availableJobs.findIndex(job => job.id === jobId)
      if (index === -1) return
      state.acceptedJobs.push({ ...state.availableJobs[index], status: 'upcoming' })
      state.availableJobs.splice(index, 1)
    }
  },
  actions: {
    acceptJob({ commit, state }, jobId) {
      if (!state.availableJobs.some(job => job.id === jobId)) return false
      commit('acceptJob', jobId)
      return true
    }
  }
}