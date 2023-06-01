<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'BarChart',
    mounted() {
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                type: 'category',
            },
            yAxis: {
                show: false,
            },
            series: {
                type: 'bar',
                data: [10, 7, 33, 12, 88, 55, 99, 4, 33, 85, 61, 49],
                color: 'cyan',
                smooth: true,
            },
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            tooltip:{},
        })
    },
}
</script>

<style>
.charts {
    width: 50%;
    height: 50%;
}
</style>