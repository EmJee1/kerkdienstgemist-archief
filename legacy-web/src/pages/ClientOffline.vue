<template>
	<div class="section">
		<div class="container">
			<div class="offline-container">
				<h1 class="title">Hey, je bent offline!</h1>
				<p>
					Maak verbinding met een netwerk om gebruik te maken van het archief
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.offline-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 60vh;

	& > * {
		text-align: center;
	}
}
</style>
