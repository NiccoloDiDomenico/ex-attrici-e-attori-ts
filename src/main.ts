// Milestone 1
// Type for Person
type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
}

// Milestone 2
// actress nationality
type ActressNationality = "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese"

// Type for Actress
type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: ActressNationality;
}

// Milestone 3
// Type guard to check if data is an Actress
function isActress(data: unknown): data is Actress {
  const validNationalities = [
    "American", "British", "Australian", "Israeli-American",
    "South African", "French", "Indian", "Israeli",
    "Spanish", "South Korean", "Chinese"
  ];

  // Check if data is an object and has the required properties
  if (typeof data === 'object' && data !== null &&
    "id" in data && typeof data.id === 'number' &&
    "name" in data && typeof data.name === 'string' &&
    "birth_year" in data && typeof data.birth_year === 'number' &&
    (!("death_year" in data) || typeof data.death_year === 'number') &&
    "biography" in data && typeof data.biography === 'string' &&
    "image" in data && typeof data.image === 'string' &&
    "most_famous_movies" in data && Array.isArray(data.most_famous_movies) && data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(movie => typeof movie === 'string') &&
    "awards" in data && typeof data.awards === 'string' &&
    "nationality" in data && typeof data.nationality === 'string' &&
    validNationalities.includes(data.nationality)
  ) {
    return true;
  }
  return false;
}

// getActress function
async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }
    const data: unknown = await response.json();
    if (!isActress(data)) {
      throw new Error("Dati non validi per un'attrice");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell'attrice:", error.message);
    }
    return null;
  }
}

// Example getActress call
(async () => {
  try {
    const actress = await getActress(1);
    if (actress) {
      console.log("Attrice trovata:", actress);
    } else {
      console.log("Nessuna attrice trovata.");
    }
  } catch (error) {
    console.error("Errore:", error);
  }
})();

// Milestone 4
// Function to get all actresses
async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch("http://localhost:3333/actresses");
    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }
    const data: unknown = response.json();
    if (!Array.isArray(data) || !data.every(isActress)) {
      throw new Error("Dati non validi per le attrici");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici:", error.message);
    }
    return [];
  }
}

// Example getAllActresses call
(async () => {
  try {
    const actresses = await getAllActresses();
    if (actresses.length > 0) {
      console.log("Attrici trovate:", actresses);
    } else {
      console.log("Nessuna attrice trovata.");
    }
  } catch (error) {
    console.error("Errore:", error);
  }
}
)();

// Milestone 5
// Function to get actresses by IDs
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Errore durante il recupero delle attrici: ${ids}:`, error.message);
    }
    return [];
  }
}

// Example getActresses call
(async () => {
  try {
    const ids = [1, 2, 3]; // Example IDs
    const actresses = await getActresses(ids);
    console.log("Attrici trovate:", actresses);
  } catch (error) {
    console.error("Errore:", error);
  }
}
)();

// Bonus 1
// Function to create a new actress omitting the 'id' field
function createActress(actress: Omit<Actress, 'id'>): Actress {
  const newId = Math.floor(Math.random() * 1000);
  return {
    id: newId,
    ...actress
  }
}

// Example createActress call
createActress({
  name: "Emma Stone",
  birth_year: 1988,
  biography: "Emma Stone is an American actress known for her roles in La La Land and Easy A.",
  image: "https://example.com/emma_stone.jpg",
  most_famous_movies: ["La La Land", "Easy A", "The Favourite"],
  awards: "Academy Award for Best Actress",
  nationality: "American"
})

// Function to update an existing actress with partial modifications
function updateActress(utente: Actress, modifiche: Partial<Omit<Actress, 'id' | 'name'>>): Actress {
  return {
    ...utente,
    ...modifiche
  };
}

// Example updateActress call
updateActress({
  id: 1,
  name: "Emma Watson",
  birth_year: 1990,
  biography: "Emma Watson is a British actress and activist known for her role as Hermione Granger in the Harry Potter series.",
  image: "https://example.com/emma_watson.jpg",
  most_famous_movies: ["Harry Potter and the Philosopher's Stone", "Beauty and the Beast", "Little Girls"],
  awards: "British Academy Film Award for Best Actress in a Leading Role",
  nationality: "British"
}, {
  biography: "Emma Watson is a British actress and activist known for her role as Hermione Granger in the Harry Potter series"
});


// Bonus 2
// Actor nationality
type ActorNationality = ActressNationality | "New Zealand" | "Hong Kong" | "German" | "Canadian" | "Irish"

// Type for Actor
type Actor = Person & {
  known_for: [string, string, string];
  awards: [string] | [string, string];
  nationality: ActorNationality;
}

// Type guard to check if data is an Actor
function isActor(data: unknown): data is Actor {
  const validNationalities = [
    // Actress nationalities
    "American", "British", "Australian", "Israeli-American",
    "South African", "French", "Indian", "Israeli",
    "Spanish", "South Korean", "Chinese",
    // Additional Actor nationalities
    "Scottish", "New Zealand", "Hong Kong", "German", "Canadian", "Irish"
  ];

  if (typeof data === 'object' && data !== null &&
    "id" in data && typeof data.id === 'number' &&
    "name" in data && typeof data.name === 'string' &&
    "birth_year" in data && typeof data.birth_year === 'number' &&
    (!("death_year" in data) || typeof data.death_year === 'number') &&
    "biography" in data && typeof data.biography === 'string' &&
    "image" in data && typeof data.image === 'string' &&
    "known_for" in data && Array.isArray(data.known_for) && data.known_for.length === 3 &&
    data.known_for.every(movie => typeof movie === 'string') &&
    "awards" in data && (Array.isArray(data.awards) && (data.awards.length === 1 || data.awards.length === 2)) &&
    data.awards.every(award => typeof award === 'string') &&
    "nationality" in data && typeof data.nationality === 'string' &&
    validNationalities.includes(data.nationality)
  ) {
    return true;
  }
  return false;
}

// Function to get an actor by ID
async function getActor(id: number): Promise<Actor | null> {
  try {
    const response = await fetch(`http://localhost:3333/actors/${id}`);
    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }
    const data: unknown = await response.json();
    if (!isActor(data)) {
      throw new Error("Dati non validi per un attore");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell'attore:", error.message);
    }
    return null;
  }
}

// Example getActor call
(async () => {
  try {
    const actor = await getActor(2);
    if (actor) {
      console.log("Attore trovato:", actor);
    } else {
      console.log("Nessun attore trovato.");
    }
  } catch (error) {
    console.error("Errore:", error);
  }
})();

// Function to get all actors
async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch("http://localhost:3333/actors");
    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(isActor)) {
      throw new Error("Dati non validi per gli attori");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero degli attori:", error.message);
    }
    return [];
  }
}

// Example getAllActors call
(async () => {
  try {
    const actors = await getAllActors();
    if (actors.length > 0) {
      console.log("Attori trovati:", actors);
    } else {
      console.log("Nessun attore trovato.");
    }
  } catch (error) {
    console.error("Errore:", error);
  }
})();

// Function to get actors by IDs
async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = ids.map(id => getActor(id));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Errore durante il recupero degli attori: ${ids}:`, error.message);
    }
    return [];
  }
}

// Example getActors call
(async () => {
  try {
    const ids = [1, 2, 3]; // Example IDs
    const actors = await getActors(ids);
    console.log("Attori trovati:", actors);
  } catch (error) {
    console.error("Errore:", error);
  }
})();

// Function to create a new actor omitting the 'id' field
function createActor(actor: Omit<Actor, 'id'>): Actor {
  const newId = Math.floor(Math.random() * 1000);
  return {
    id: newId,
    ...actor
  }
}

// Example createActor call
createActor({
  name: "Ryan Gosling",
  birth_year: 1980,
  biography: "Ryan Gosling is a Canadian actor known for his roles in La La Land and Drive.",
  image: "https://example.com/ryan_gosling.jpg",
  known_for: ["La La Land", "Drive", "The Notebook"],
  awards: ["Golden Globe Award for Best Actor"],
  nationality: "Canadian"
});

// Function to update an existing actor with partial modifications
function updateActor(actor: Actor, modifications: Partial<Omit<Actor, 'id' | 'name'>>): Actor {
  return {
    ...actor,
    ...modifications
  };
}

// Example updateActor call
updateActor({
  id: 40,
  name: "Leonardo DiCaprio",
  birth_year: 1974,
  biography: "Leonardo DiCaprio is an American actor and film producer known for his roles in Titanic, Inception, and The Revenant.",
  image: "https://example.com/leonardo_dicaprio.jpg",
  known_for: ["Titanic", "Inception", "The Revenant"],
  awards: ["Academy Award for Best Actor", "Golden Globe Award for Best Actor"],
  nationality: "American"
}, {
  biography: "Leonardo DiCaprio is an American actor and film producer known for his roles in Titanic, The Wolf of Wall Strett, and The Revenant."
});

// Bonus 3
// Function to get a random cople of actors and actresses
async function createRandomCouple(): Promise<[Actress, Actor]> {
  try {
    const [actresses, actors] = await Promise.all([getAllActresses(), getAllActors()]);
    if (actresses.length === 0 || actors.length === 0) {
      throw new Error("Nessuna attrice o attore trovato.");
    }
    const randomActress = actresses[Math.floor(Math.random() * actresses.length)];
    const randomActor = actors[Math.floor(Math.random() * actors.length)];
    return [randomActress, randomActor];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante la creazione della coppia casuale:", error.message);
    }
    throw error;
  }
}

// Example createRandomCouple call
(async () => {
  try {
    const couple = await createRandomCouple();
    console.log("Coppia casuale trovata:", couple);
  } catch (error) {
    console.error("Errore:", error);
  }
}
)();