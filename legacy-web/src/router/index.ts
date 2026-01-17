import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { auth } from '../firebase/firebase'
import Login from '../pages/Login.vue'
import KerdienstGemist from '../pages/Archive.vue'
import Embedding from '../pages/Embedding.vue'
import IFrameEmbed from '../pages/IFrameEmbed.vue'

type RouteRecordMeta = {
	meta: {
		loggedIn: boolean
	}
}
type RouteRecord = RouteRecordRaw & RouteRecordMeta

const routes: RouteRecord[] = [
	{
		path: '/',
		redirect: '/archive',
		meta: {
			loggedIn: true,
		},
	},
	{
		path: '/login',
		component: Login,
		meta: {
			loggedIn: false,
		},
	},
	{
		path: '/archive',
		component: KerdienstGemist,
		meta: {
			loggedIn: true,
		},
	},
	{
		path: '/embedding',
		component: Embedding,
		meta: {
			loggedIn: true,
		},
	},
	{
		path: '/iframe-embed',
		component: IFrameEmbed,
		meta: {
			loggedIn: false,
		},
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	if (to.meta.loggedIn && !auth.currentUser) {
		// is not logged in on a protected route
		// redirect to login page
		return next({ path: '/login' })
	}

	next()
})
