const state = {
  features: [],
  learningPaths: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_FEATURES(state, features) {
    state.features = features;
  },
  SET_LEARNING_PATHS(state, paths) {
    state.learningPaths = paths;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchFeatures({ commit }) {
    try {
      commit("SET_LOADING", true);
      // Simulate API call - replace with actual API call
      const features = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`,
              title: "Interactive Lessons",
              description: "Engaging, hands-on learning experiences",
            },
            {
              id: 2,
              icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z" />
           </svg>`,
              title: "Expert Instructors",
              description: "Learn from industry professionals",
            },
            {
              id: 3,
              icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`,
              title: "Progress Tracking",
              description: "Monitor your learning journey",
            },
          ]);
        }, 500);
      });
      commit("SET_FEATURES", features);
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async fetchLearningPaths({ commit }) {
    try {
      commit("SET_LOADING", true);
      // Simulate API call - replace with actual API call
      const paths = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "Beginner",
              description: "Start your journey here",
              link: "/beginner",
              icon: "/images/path-beginner.png",
              svg: `
              <svg class="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/>
              </svg>
            `,
            },
            {
              id: 2,
              title: "Intermediate",
              description: "Build on your skills",
              link: "/intermediate",
              icon: "/images/path-intermediate.png",
              svg: `
              <svg class="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="none"/>
                <path d="M10 8l6 4-6 4z" fill="#fff"/>
              </svg>
            `,
            },
            {
              id: 3,
              title: "Advanced",
              description: "Master advanced concepts",
              link: "/advanced",
              icon: "/images/path-advanced.png",
              svg: `
              <svg class="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 6h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            `,
            },
          ]);
        }, 500);
      });
      commit("SET_LEARNING_PATHS", paths);
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  features: (state) => state.features,
  learningPaths: (state) => state.learningPaths,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
