const boton = document.querySelector("#boton");
const monedas = document.querySelector("#monedas");
let myChart = document.getElementById("myChart");
let chart = "";
async function getMoneda() {
  try {
    //llamamos a api de miindicador.cl
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json();

    //seteamos datos en select de monedas.

    monedas.innerHTML += `<option value="${data.dolar.valor}">${data.dolar.codigo.toUpperCase()}</option>
        <option value="${data.euro.valor}">${data.euro.codigo.toUpperCase()}</option>
        <option value="${data.uf.valor}">${data.uf.codigo.toUpperCase()}</option>`;
  } catch (e) {
    alert(e.message);
  }
}

getMoneda();

//Creamos evento al hacer click el boton
boton.addEventListener("click", function () {
  const clp = document.querySelector("#clp").value;
  const p = document.querySelector("#resultado");
  //realizamos el calculo
  let calculo = parseInt(clp) * parseFloat(monedas.value);
  //obtenemos la moneda seleccionada
  let monedaSeleccionada = monedas.options[monedas.selectedIndex].text;
  renderGrafica(monedaSeleccionada.toLowerCase());
  p.innerHTML = `Resultado: $${calculo}`;
});

async function getAndCreateDataToChart(moneda) {
  const res = await fetch(`https://mindicador.cl/api/${moneda}`);
  const monedaSeleccionada = await res.json();
  const labels = monedaSeleccionada.serie.map((fecha) => {
    return fecha.fecha.substring(0, 10);
  });
  const data = monedaSeleccionada.serie.map((valor) => {
    const valorMoneda = valor.valor;
    return Number(valorMoneda);
  });

  const datasets = [
    {
      label: `Historial de Valor de ${moneda.toUpperCase()}`,
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return {labels, datasets };
}

async function renderGrafica(moneda) {
  if (chart != "") {
    chart.destroy();
  }
  const data = await getAndCreateDataToChart(moneda);
  const config = {
    type: "line",
    data,
  };
  myChart.style.backgroundColor = "white";
  chart = new Chart(myChart, config);
}
