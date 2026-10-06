import React from "react";
import ReactECharts from "echarts-for-react";

const PieChart = ({
    data = [],
    height = "300px",
}) => {

    const option = {
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
        },

        legend: {
            bottom: 0,
            left: "center",
            type: "scroll",
        },

        series: [
            {
                type: "pie",
                radius: ["0%", "60%"],
                center: ["50%", "45%"],

                data: data,

                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.3)",
                    },
                },

                label: {
                    show: true,
                    formatter: "{b}\n{c}",
                },

                labelLine: {
                    show: true,
                },
            },
        ],
    };

    return (
        <div
            style={{
                width: "100%",
                height,
                minWidth: 0,
                overflow: "hidden",
            }}
        >
            <ReactECharts
                option={option}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                opts={{
                    renderer: "canvas",
                }}
            />
        </div>
    );
};

export default PieChart;