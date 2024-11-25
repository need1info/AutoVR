document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Konstanten für Berechnungen
    const PETROL_CO2_PER_LITER = 2.37; // kg CO2 pro Liter Benzin
    const DIESEL_CO2_PER_LITER = 2.65; // kg CO2 pro Liter Diesel
    const ELECTRICITY_CO2_PER_KWH = 0.366; // kg CO2 pro kWh (deutscher Strommix 2023)

    calculateBtn.addEventListener('click', calculateConsumption);
    resetBtn.addEventListener('click', resetCalculator);

    function calculateConsumption() {
        // Verbrenner-Daten
        const fuelConsumption = parseFloat(document.getElementById('fuelConsumption').value);
        const fuelType = document.getElementById('fuelType').value;
        const fuelPrice = parseFloat(document.getElementById('fuelPrice').value);
        const yearlyKm = parseFloat(document.getElementById('yearlyKm').value);
        const vehicleWeight = parseFloat(document.getElementById('vehicleWeight').value);

        // Elektro-Daten
        const powerConsumption = parseFloat(document.getElementById('powerConsumption').value);
        const electricityPrice = parseFloat(document.getElementById('electricityPrice').value);
        const batteryCapacity = parseFloat(document.getElementById('batteryCapacity').value);
        const maxRange = parseFloat(document.getElementById('maxRange').value);
        const electricVehicleWeight = parseFloat(document.getElementById('electricVehicleWeight').value);

        // Überprüfen der Eingaben
        if (!validateInputs(fuelConsumption, fuelPrice, yearlyKm, vehicleWeight, 
                          powerConsumption, electricityPrice, batteryCapacity, maxRange, electricVehicleWeight)) {
            alert('Bitte füllen Sie alle Felder korrekt aus.');
            return;
        }

        // Berechnung der Kosten für Verbrenner
        const monthlyFuelCosts = calculateMonthlyCosts(fuelConsumption, fuelPrice, yearlyKm);
        const yearlyFuelCosts = monthlyFuelCosts * 12;
        const fuelCostsPer100km = (fuelConsumption * fuelPrice);

        // Berechnung der Kosten für Elektrofahrzeug
        const monthlyElectricCosts = calculateMonthlyCosts(powerConsumption, electricityPrice, yearlyKm, true);
        const yearlyElectricCosts = monthlyElectricCosts * 12;
        const electricCostsPer100km = (powerConsumption * electricityPrice);

        // CO2-Berechnung
        const yearlyCO2 = calculateYearlyCO2(fuelType, fuelConsumption, powerConsumption, yearlyKm);

        // Ergebnisse anzeigen
        displayResults(
            monthlyFuelCosts,
            yearlyFuelCosts,
            fuelCostsPer100km,
            monthlyElectricCosts,
            yearlyElectricCosts,
            electricCostsPer100km,
            yearlyCO2
        );
    }

    function validateInputs(...inputs) {
        return inputs.every(input => !isNaN(input) && input > 0);
    }

    function calculateMonthlyCosts(consumption, price, yearlyKm, isElectric = false) {
        const monthlyKm = yearlyKm / 12;
        if (isElectric) {
            return (consumption * price * monthlyKm) / 100;
        }
        return (consumption * price * monthlyKm) / 100;
    }

    function calculateYearlyCO2(fuelType, fuelConsumption, powerConsumption, yearlyKm) {
        let combustionCO2;
        if (fuelType === 'petrol') {
            combustionCO2 = (fuelConsumption * PETROL_CO2_PER_LITER * yearlyKm) / 100;
        } else {
            combustionCO2 = (fuelConsumption * DIESEL_CO2_PER_LITER * yearlyKm) / 100;
        }
        
        const electricCO2 = (powerConsumption * ELECTRICITY_CO2_PER_KWH * yearlyKm) / 100;
        
        return {
            combustion: Math.round(combustionCO2),
            electric: Math.round(electricCO2)
        };
    }

    function displayResults(monthlyFuel, yearlyFuel, fuelPer100km, 
                          monthlyElectric, yearlyElectric, electricPer100km, co2) {
        document.getElementById('monthlyCosts').innerHTML = `
            <div class="result-row">
                <span class="combustion-result">Verbrenner: ${monthlyFuel.toFixed(2)}€</span>
            </div>
            <div class="result-row">
                <span class="electric-result">Elektro: ${monthlyElectric.toFixed(2)}€</span>
            </div>
        `;
        
        document.getElementById('yearlyCosts').innerHTML = `
            <div class="result-row">
                <span class="combustion-result">Verbrenner: ${yearlyFuel.toFixed(2)}€</span>
            </div>
            <div class="result-row">
                <span class="electric-result">Elektro: ${yearlyElectric.toFixed(2)}€</span>
            </div>
        `;
        
        document.getElementById('costsPer100km').innerHTML = `
            <div class="result-row">
                <span class="combustion-result">Verbrenner: ${fuelPer100km.toFixed(2)}€</span>
            </div>
            <div class="result-row">
                <span class="electric-result">Elektro: ${electricPer100km.toFixed(2)}€</span>
            </div>
        `;
        
        document.getElementById('co2Emissions').innerHTML = `
            <div class="result-row">
                <span class="combustion-result">Verbrenner: ${co2.combustion} kg</span>
            </div>
            <div class="result-row">
                <span class="electric-result">Elektro: ${co2.electric} kg</span>
            </div>
        `;
    }

    function resetCalculator() {
        // Reset Verbrenner-Formular
        document.getElementById('combustionForm').reset();
        
        // Reset Elektro-Formular
        document.getElementById('electricForm').reset();
        
        // Reset Ergebnisse
        document.getElementById('monthlyCosts').innerHTML = '-';
        document.getElementById('yearlyCosts').innerHTML = '-';
        document.getElementById('costsPer100km').innerHTML = '-';
        document.getElementById('co2Emissions').innerHTML = '-';
    }

    // Automatisches Ausfüllen mit Beispielwerten
    function fillExampleValues() {
        document.getElementById('fuelConsumption').value = "7.5";
        document.getElementById('fuelPrice').value = "1.85";
        document.getElementById('yearlyKm').value = "15000";
        document.getElementById('vehicleWeight').value = "1500";
        
        document.getElementById('powerConsumption').value = "18";
        document.getElementById('electricityPrice').value = "0.30";
        document.getElementById('batteryCapacity').value = "58";
        document.getElementById('maxRange').value = "400";
        document.getElementById('electricVehicleWeight').value = "2000";
    }

    // Optional: Beispielwerte beim Laden der Seite einfügen
    // fillExampleValues();
});
