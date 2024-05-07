const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Lượt truy cập",
      backgroundColor: "blue",
      borderColor: "blue",
      data: [10, 27, 56, 45, 34, 54],
      tension: 0.4,
    },
    {
      label: "Đơn hàng",
      backgroundColor: "red",
      borderColor: "red",
      data: [10, 4, 42, 68, 8, 54],
      tension: 0.4,
    },
  ],
};

const config = {
  type: "line",
  data: data,
};

const canvas = document.getElementById("canvas");
const chart = new Chart(canvas, config);
