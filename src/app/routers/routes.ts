import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@pages/Home')
    },
    {
        path: "/setting",
        component: () => import('@pages/Setting'),
    }
];

export default routes;
