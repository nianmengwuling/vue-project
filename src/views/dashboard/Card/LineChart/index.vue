<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'LineChart',

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
                type: 'line',
                data: [10, 7, 33, 12, 88, 55, 99, 4, 9],
                itemStyle: {
                    opacity: 0,
                },
                lineStyle: {
                    color: 'green',
                },
                areaStyle: {
                    color: {
                        opacity: 0.2,
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'purple' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#fff' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    },
                },
                smooth: true,
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