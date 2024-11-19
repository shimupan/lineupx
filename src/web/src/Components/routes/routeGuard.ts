// routeGuard.ts
import axios from 'axios';

type ValidateFunction = (params: Record<string, string>) => Promise<boolean>;

interface RouteConfig {
  validate: ValidateFunction;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Posts routes
  '/post/:game/:id': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/post/detail/${params.game}/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },
  '/game/:game/:id': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/post/detail/${params.game}/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },

  // User routes
  '/user/:id': {
    validate: async (params) => {
      try {
        if (params.id === 'guest') return true;
        const response = await axios.get(`/user/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },

  // Game specific routes
  '/game/valorant/agents/:agentName/lineups': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/game/valorant/agent/${params.agentName}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },
  '/game/valorant/agents/:agentName/lineups/:mapName': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/game/valorant/map/${params.mapName}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },
  '/game/valorant/lineups/:mapName': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/game/valorant/map/${params.mapName}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },
  '/game/cs2/lineups/:mapName': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/game/cs2/map/${params.mapName}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },

  // Admin routes
  '/admin/user/:id': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/admin/user/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },
  '/admin/post/:id': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/admin/post/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },

  // Developer routes
  '/developer/post/:id': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/developer/post/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },

  // Manage and edit posts routes
  '/manage-posts/:id': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/user/posts/${params.id}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },
  '/edit-post/:game/:id/:postId': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/post/${params.game}/${params.postId}`);
        return !!response.data;
      } catch {
        return false;
      }
    }
  },

  // Search routes
  '/search/:game/:query': {
    validate: async (params) => {
      try {
        const response = await axios.get(`/search/${params.game}/${params.query}`);
        return Array.isArray(response.data);
      } catch {
        return false;
      }
    }
  }
};