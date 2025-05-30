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
// Type for Actress
type Actress = Person & {
  most_famous_movie: [string, string, string];
  awards: string;
  nationality: "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese"
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
    "most_famous_movie" in data && Array.isArray(data.most_famous_movie) && data.most_famous_movie.length === 3 &&
    data.most_famous_movie.every(movie => typeof movie === 'string') &&
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
