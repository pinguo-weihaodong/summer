<template>
	<div class="hello">
		<div class="text">{{text}}</div>
		<canvas id="canvas"></canvas>
		<img v-if="img" :src="img" alt="" class="img">
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Summer from "../common/summer";

@Component
export default class HelloWorld extends Vue {
	  @Prop() private msg!: string;
	  
	  text: string = ''
	  img: string = ''
	
	mounted() {

		// let text = `sadfasfsadfasfsadfasfsadfasf asdfjkasda\n sadfasfsadfasfsadfasfsadfasfsadfasf\nadsfasdfasdfasd`
		let text = `一二三四五六七八九`
		// let text = `一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十`

		let canvas = new Summer({
			ratio: 1,
			canvasId: 'canvas',
			canvasWidth: 320,
			canvasHeight: 400,
			// canvasHeight: 'auto',
			// ground: {
			// 	radius: 20,
			// 	color: `rgba(102, 153, 255, 0.5)`
			// },
			tasks: [
				{
					type: 'rect',
					id: 'board',
					radius: 80,
					border: {
						width: 2,
						color: 'red'
					},
					x: 100,
					y: 2,
					width: 120,
					height: 120,
					backgroundColor: 'rgba(102, 153, 255, 1)'
				},
				// {
				// 	type: 'img',
				// 	id: 'top_img',
				// 	img: 'https://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYwOTUxOTYyODEy',
				// 	x: 30,
				// 	y: 20,
				// 	width: 240,
				// 	height: 100
				// },
				{
					type: 'wrap',
					id: 'mid_wrap',
					tasks: [
						{
							type: 'img',
							id: 'main_img',
							img: 'https://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYwOTUxOTYyODEy',
							radius: 5,
							x: 30,
							y: 90,
							width: 240,
							// dependOn: {
							// 	id: 'top_img',
							// 	direction: 'vertical',
							// 	margin: 20
							// },
							shadow: {
								offsetX: 0,
								offsetY: 5,
								blur: 10,
								color: 'red'
							},
						},
					]
				},
				// {
				// 	type: 'rect',
				// 	id: 'num_board',
				// 	radius: 4,
				// 	x: 42,
				// 	dependOn: {
				// 		id: 'main_img',
				// 		direction: 'vertical',
				// 		margin: -20
				// 	},
				// 	width: 100,
				// 	height: 40,
				// 	backgroundColor: 'rgba(102, 153, 255, 0.7)'
				// }
			]
		})

		// {
		// 	type: 'text',
		// 	id: 'theme',
		// 	width: 230,
		// 	text: text,
		// 	fontSize: 24,
		// 	lineHeight: 34,
		// 	fontWeight: 'normal',
		// 	x: 70,
		// 	y: 80,
		// 	dependOn: {
		// 		id: 'avatar',
		// 		direction: 'cross',
		// 		margin: 10
		// 	},
		// 	textAlign: 'right',
		// 	color: `#6699FF`
		// },
		// {
		// 	type: 'text',
		// 	id: 'title',
		// 	width: 200,
		// 	text: 'text',
		// 	fontSize: 24,
		// 	lineHeight: 34,
		// 	fontWeight: 'normal',
		// 	x: 70,
		// 	y: 180,
		// 	dependOn: {
		// 		id: 'theme',
		// 		direction: 'vertical',
		// 		margin: 0
		// 	},
		// 	textAlign: 'right',
		// 	color: `red`
		// },
		// {
		// 	type: 'img',
		// 	id: 'avatar',
		// 	img: 'https://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYwOTUxOTYyODEy',
		// 	// radius: 50,
		// 	x: 22,
		// 	y: 40,
		// 	width: 100,
		// 	// border: {
		// 	// 	width: 10,
		// 	// 	color: 'black'
		// 	// },
		// 	dependOn: {
		// 		id: 'board',
		// 		direction: 'vertical',
		// 		margin: 20
		// 	},
		// 	last: {
		// 		margin: 10
		// 	},
		// 	// shadow: {
		// 	// 	offsetX: 7,
		// 	// 	offsetY: 10,
		// 	// 	blur: 10,
		// 	// 	color: 'red'
		// 	// },
		// },
		// {
		// 	type: 'rect',
		// 	id: 'board',
		// 	radius: 10,
		// 	border: {
		// 		width: 6,
		// 		color: 'red'
		// 	},
		// 	x: 42,
		// 	y: 20,
		// 	width: 190,
		// 	height: 20,
		// 	backgroundColor: 'rgba(102, 153, 255, 1)'
		// }
		this.text = '加载中'
		canvas.draw((img: string, size: { width: string, height: string }) => {
			this.img = img
			this.text = '加载完成'
			// console.log('saa: ', size)
		})
	}
}
</script>

<style scoped lang="less">
* {
	font-size: 0;
}
.text {
	font-size: 30px;
	color: #ffffff;
}
#canvas {
	width: 160px;
	height: 200px;
	background: #ffffff;
}
.img {
	width: 160px;
	margin-top: 90px;
}
</style>
