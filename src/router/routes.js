const routes = [
  {
    path: '/',
    component: () => import('layouts/layout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
      },
      {
        path: '/track/:id',
        component: () => import('pages/Track.vue'),
      },
      {
        path: '/notconnected', component: () => import('pages/NotConnected.vue'),
      },
    ],
  },
  {
    path: '/auth',
    name: 'auth',
    meta: { auth: false },
    component: () => import('layouts/authLayout'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('components/auth/login'),
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
