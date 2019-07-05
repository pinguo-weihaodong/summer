<template>
	<div class="hello">
		<div class="text" @click="handleStartDraw">{{text}}</div>
		<canvas id="canvas"></canvas>
		<img v-if="img" :src="img" alt="" class="img">
		<!-- <img src="../assets/1.png" alt="" class="img"> -->
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Summer from "../common/summer";

@Component
export default class HelloWorld extends Vue {
	@Prop() private msg!: string;
	
	text: string = '开始'
	img: string = ''
	
	handleStartDraw() {
	}
	mounted() {
// MTg1ODMyNjkxMDcxNTYyMjkyOTk5MDA2
// MTg1ODMyNjkxMDcxNTYyMjMxMDk3NDgx
// MTg1ODMyNjkxMDcxNTYyMjMxMTA1ODA5
// MTg1ODMyNjkxMDcxNTYyMjMxMTA3MDg1
// MTg1ODMyNjkxMDcxNTYyMjMxMTA4MDY1
		// let text = `sadfasfsadfasfsadfasfsadfasf asdfjkasda\n sadfasfsadfasfsadfasfsadfasfsadfasf\nadsfasdfasdfasd`
		let text = `一二三四五六七八九`
		// let text = `一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十`

		let canvas = new Summer({
			ratio: 3,
			canvasId: 'canvas',
			canvasWidth: 343,
			canvasHeight: 'auto',
			// canvasHeight: 300,
			radius: 30,
			// canvasHeight: 200,
			// backgroundColor: 'red',
			tasks: [
				{
					type: 'rect',
					id: 'top_cicle_border',
					radius: 80,
					x: 90,
					y: 0,
					width: 162,
					height: 162,
					background: {
						color: 'linear(to s, 0 #fff7be, 100% #f9b71c)'
					}
				},
				{
					type: 'rect',
					id: 'top_cicle',
					radius: 80,
					x: 92,
					y: 2,
					width: 158,
					height: 158,
					background: {
						color: '#181a25'
					}
				},
				{
					type: 'wrap',
					id: 'main_wrap_border',
					width: 343,
					x: 0,
					y: 54,
					radius: 20,
					last: {
						margin: 2
					},
					height: 'auto',
					background: {
						color: 'linear(to s, 0 #fff7be, 100% #f9b71c)'
					},
					tasks: [
						{
							type: 'wrap',
							id: 'main_wrap',
							width: 339,
							x: 2,
							y: 2,
							radius: 18,
							last: {
								margin: 2
							},
							height: 'auto',
							background: {
								mode: 'cover',
								image: 'http://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYyMjMxMDk3NDgx'
							},
							tasks: [
								{
									type: 'img',
									id: 'top_img',
									img: 'http://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYyMjMxMTA1ODA5',
									x: -2,
									y: -36,
									width: 343,
									height: 122
								},
								{
									type: 'img',
									id: 'photo_img',
									img: 'https://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYwOTUxOTYyODEy',
									x: 20,
									y: 105,
									radius: 5,
									width: 297,
									shadow: {
										offsetY: 4,
										blur: 9,
										color: 'rgba(0,0,0,0.9)'
									}
								},
								{
									type: 'img',
									id: 'qrcode_img',
									img: 'https://c360-o2o.c360dn.com/MTg1ODMyNjkxMDcxNTYwOTUxOTYyODEy',
									x: 22,
									y: 20,
									dependOn: {
										id: 'photo_img',
										direction: 'vertical',
										margin: 32
									},
									width: 64,
									height: 64
								},
								{
									type: 'text',
									id: 'qrcode_text',
									text: '扫码查看图片',
									x: 22,
									y: 4,
									width: 64,
									radius: 2,
									fontSize: 10,
									dependOn: {
										id: 'photo_img',
										direction: 'vertical',
										margin: 110
									},
									color: '#ffffff',
									textAlign: 'center'
								},
								{
									type: 'text',
									id: 'scan_text',
									text: '2200次浏览',
									x: 343 / 2,
									// x: 4,
									y: 4,
									background: {
										color: 'rgba(0,0,0,0.8)'
									},
									padding: {
										left: 8,
										top: 3,
										right: 8,
										bot: 8
									},
									radius: 2,
									fontSize: 12,
									lineHeight: 12,
									dependOn: {
										id: 'photo_img',
										direction: 'vertical',
										margin: -6
									},
									color: '#ffd970',
									textAlign: 'center',
								},
								{
									type: 'text',
									id: 'theme_text',
									text: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十 asdfsf',
									x: 109,
									width: 214,
									fontSize: 15,
									lineHeight: 22,
									maxLine: 2,
									dependOn: {
										id: 'photo_img',
										direction: 'vertical',
										margin: 30
									},
									fontWeight: 'bold',
									color: '#ffffff',
									// x: 171.5,
									textAlign: 'left',
								},
								{
									type: 'text',
									id: 'time_text',
									text: 'asdfasasdfasdf asdfsf',
									x: 109,
									width: 214,
									fontSize: 12,
									lineHeight: 18,
									maxLine: 1,
									dependOn: {
										id: 'photo_img',
										direction: 'vertical',
										margin: 86
									},
									color: 'rgb(108,112,135)',
									textAlign: 'left',
								},
								{
									type: 'text',
									id: 'place_text',
									text: '哈哈哈 asdfsfasdfasasdfasdf asdfsfasdfasasdfasdf asdfsfasdfasasdfasdf asdfsf',
									x: 109,
									width: 214,
									fontSize: 12,
									lineHeight: 18,
									maxLine: 1,
									last: {
										margin: 30
									},
									dependOn: {
										id: 'photo_img',
										direction: 'vertical',
										margin: 108
									},
									color: 'rgb(108,112,135)',
									textAlign: 'left',
								},
							]
						},
					]
				},
			]
		})
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
	// background: linear-gradient(to right, 10% #000, 100% #fff);
	width: 160px;
	margin-top: 90px;
}
</style>
