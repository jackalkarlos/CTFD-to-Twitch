let jsonData;
let first50;

const container = d3.select("#container");

function processData(jsonData) {
    const processedData = jsonData.data.map(entry => {
        return {
            name: entry.name,
            score: entry.score
        };
    });

    return processedData;
}

// Kutuları oluştur ve güncelle
function updateBoxes(data) {
    data.sort((a, b) => b.score - a.score);
    const boxes = container.selectAll(".box")
        .data(data, d => d.name);
    boxes.enter()
        .append("div")
        .attr("class", "box")
        .html(d => `<font color="white"><strong>${d.name}</strong><br><br><br><br>${d.score}</font>`);
    boxes
        .html(d => `<font color="white"><strong>${d.name}</strong><br><br><br><br>${d.score}</font>`)
        .classed("updated", true)
        .transition()
        .duration(500)
        .on("end", function() {
            d3.select(this).classed("updated", false);
        });

    // Kutuları yeniden sıralayın
    boxes.order();

    // Eski öğeleri kaldır
    boxes.exit().remove();
}

// JSON verisini URL'den çek
async function fetchData() {
    try {
        const url = `https://example.com.tr/api/v1/scoreboard`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ctfd_examplehash',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        jsonData = await response.json();
        first50 = processData(jsonData).slice(0, 50);
        updateBoxes(first50);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

setInterval(fetchData, 10000);
fetchData();
