export default {
  namespaced: true,

  state: {
    availableJobs: [],
    acceptedJobs: [],
    completedJobs: [],
    reviews: [],
    loading: false,
    error: null
  },

  getters: {
    availableJobs: state => state.availableJobs,

    acceptedJobs: state => state.acceptedJobs,

    completedJobs: state => state.completedJobs,

    reviews: state => state.reviews,

    totalEarnings: state =>
      [...state.acceptedJobs, ...state.completedJobs]
        .reduce((sum, job) => sum + Number(job.pay || 0), 0),

    scheduledJobs: state =>
      state.acceptedJobs.filter(job => job.status === 'assigned'),

    upcomingJobs: state =>
      state.acceptedJobs.filter(job =>
        job.status === 'assigned' || job.status === 'in_progress'
      ),

    loading: state => state.loading,

    error: state => state.error
  },

  mutations: {
    SET_LOADING(state, value) {
      state.loading = value
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_JOBS(state, jobs) {
      state.availableJobs = []
      state.acceptedJobs = []
      state.completedJobs = []

      jobs.forEach(job => {
        const formattedJob = {
          ...job,

          // Names expected by the existing dashboard
          client: job.student_name || 'Student',
          location: job.residence_name || 'Residence',

          // The database currently does not have a pay field
          pay: Number(job.estimated_cost || 0),

          // Keep the database status
          status: job.status
        }

        if (job.status === 'completed') {
          state.completedJobs.push(formattedJob)
        } else if (
          job.status === 'assigned' ||
          job.status === 'in_progress'
        ) {
          state.acceptedJobs.push(formattedJob)
        }
      })
    }
  },

  actions: {
    async fetchProviderJobs({ commit }, providerId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await fetch(
          `http://localhost:3000/api/dashboards/provider/${providerId}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch provider jobs: ${response.status}`)
        }

        const data = await response.json()

        commit('SET_JOBS', data.jobs || [])

        return data.jobs || []
      } catch (error) {
        console.error('Failed to load provider jobs:', error)

        commit('SET_ERROR', error.message)

        return []
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}

