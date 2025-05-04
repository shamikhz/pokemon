document.addEventListener("DOMContentLoaded", () => {
    const player1 = {
        score: 0,
        name: 'Player 1',
        elements: {
            name: document.getElementById('p1_name'),
            score: document.getElementById('p1_score'),
            card: document.getElementById('card1')
        }
    };

    const player2 = {
        score: 0,
        name: 'Player 2',
        elements: {
            name: document.getElementById('p2_name'),
            score: document.getElementById('p2_score'),
            card: document.getElementById('card2')
        }
    };

    player1.elements.name.textContent = player1.name;
    player2.elements.name.textContent = player2.name;

    const fightButton = document.getElementById('fight');

    fightButton.addEventListener('click', () => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
            .then(response => response.json())
            .then(data => {
                const pokemons = data.results;
                const pokemon1 = pokemons[Math.floor(Math.random() * pokemons.length)];
                const pokemon2 = pokemons[Math.floor(Math.random() * pokemons.length)];

                Promise.all([
                    fetch(pokemon1.url).then(response => response.json()),
                    fetch(pokemon2.url).then(response => response.json())
                ]).then(([data1, data2]) => {
                    displayPokemon(player1, data1);
                    displayPokemon(player2, data2);

                    if (data1.base_experience > data2.base_experience) {
                        player1.score++;
                    } else if (data1.base_experience < data2.base_experience) {
                        player2.score++;
                    } else {
                        alert("It's a tie! Both Pokémon have the same experience.");
                    }

                    player1.elements.score.textContent = `Score: ${player1.score}`;
                    player2.elements.score.textContent = `Score: ${player2.score}`;
                });
            });
    });

    function displayPokemon(player, pokemonData) {
        const card = player.elements.card;
        card.querySelector('#img').innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" />`;
        card.querySelector('#name').textContent = `Name: ${pokemonData.name}`;
        card.querySelector('#experience').textContent = `Experience: ${pokemonData.base_experience}`;

        const abilitiesList = card.querySelector('#abilities');
        abilitiesList.innerHTML = 'Abilities';
        pokemonData.abilities.forEach(ability => {
            const li = document.createElement('li');
            li.textContent = ability.ability.name;
            abilitiesList.appendChild(li);
        });
    }
});
