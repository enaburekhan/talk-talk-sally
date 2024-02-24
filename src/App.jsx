import { useGetPokemonByNameQuery } from './services/pokemon';

function App() {
  console.log('useGetPokemonByName', useGetPokemonByNameQuery);
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur');
  console.log('data', data);
  return (
    <div>
      {error ? (
        <>oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      ) : null}
    </div>
  );
}

export default App;
