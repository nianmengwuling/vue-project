<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'ProgressChart',
    mounted() {
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                type: 'category',
            },
            series: {
                type: 'bar',
                data: [78],
                color: 'yellowgreen',
                showBackground: true,
                backgroundStyle: {
                    color: '#eee'
                },
                label:{
                    show:true,
                    formatter:'|',
                    position:'right',
                },
                barWidth: 10
            },
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
        })
    },
}
</script>

<style>
.charts {
    width: 100%;
    height: 100%;
}
</style>