import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/HomePage.vue"),
    },
    {
      path: "/store",
      component: () => import("../views/StorePage.vue"),
    },
    {
      path: "/item/:id",
      component: () => import("../views/ItemView.vue"),
      props: true,
    },
    {
      path: "/login",
      component: () => import("../views/LoginPage.vue"),
    },
    {
      path: "/cart",
      component: () => import("../views/ShoppingCart.vue"),
    },
    {
      path: "/admin",
      component: () => import("../views/admin/AdminView.vue"),
    },
    {
      path: "/admin/edit",
      component: () => import("../views/admin/EditView.vue"),
    },
    {
      path: "/admin/orders",
      component: () => import("../views/admin/AllOrders.vue"),
    },
    {
      path: "/gamble",
      component: () => import("../views/GamblingRipoff.vue"),
    },
    {
      path: "/:oops",
      component: () => import("../views/FourOhFour.vue"),
    },
  ],
});

export default router;
