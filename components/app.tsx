'use client'

import React, {useEffect, useState} from 'react'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ChevronLeft, ChevronRight, Loader, Search} from "lucide-react"
import Image from 'next/image'

interface Character {
    name: string
    height: string
    mass: string
    hair_color: string
    skin_color: string
    eye_color: string
    birth_year: string
    gender: string
    url: string
    films: string[]
    vehicles: string[]
    starships: string[]
    species: string[]
}

interface Film {
    title: string;
}

interface Vehicle {
    name: string;
}

interface Starship {
    name: string;
}

interface Species {
    name: string;
}

interface ApiResponse {
    results: Character[]
    next: string | null
    previous: string | null
}

interface Details {
    films: Film[]
    vehicles: Vehicle[]
    starships: Starship[]
    species: Species[]
}

export function App() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [nextPage, setNextPage] = useState<string | null>(null)
    const [prevPage, setPrevPage] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [details, setDetails] = useState<Details>({films: [], vehicles: [], starships: [], species: []})
    const [visibleCharacters, setVisibleCharacters] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetchCharacters('https://swapi.dev/api/people/')
    }, [])

    useEffect(() => {
        if (searchTerm) {
            handleSearch()
        } else {
            fetchCharacters('https://swapi.dev/api/people/')
        }
    }, [searchTerm])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setVisibleCharacters(5)
            } else {
                setVisibleCharacters(characters.length)
            }
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [characters])

    const fetchCharacters = async (url: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(url)
            const data: ApiResponse = await response.json()
            const sortedCharacters = data.results.sort((a, b) => a.name.localeCompare(b.name))
            setCharacters(sortedCharacters)
            setNextPage(data.next)
            setPrevPage(data.previous)
        } catch (error) {
            console.error('Error fetching characters:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`https://swapi.dev/api/people/?search=${searchTerm}`)
            const data: ApiResponse = await response.json()
            const sortedCharacters = data.results.sort((a, b) => a.name.localeCompare(b.name))
            setCharacters(sortedCharacters)
            setNextPage(data.next)
            setPrevPage(data.previous)
        } catch (error) {
            console.error('Error searching characters:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCharacterClick = async (character: Character) => {
        setSelectedCharacter(character)
        const films = await fetchDetails(character.films)
        const vehicles = await fetchDetails(character.vehicles)
        const starships = await fetchDetails(character.starships)
        const species = await fetchDetails(character.species)
        setDetails({films, vehicles, starships, species})
    }

    const fetchDetails = async (urls: string[]) => {
        const promises = urls.map(url => fetch(url).then(res => res.json()))
        return Promise.all(promises)
    }

    const getImageUrl = (characterUrl: string) => {
        const id = characterUrl.split('/').filter(Boolean).pop()
        return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`
    }

    const handleNextPage = () => {
        if (nextPage) {
            fetchCharacters(nextPage)
            setCurrentPage(prevPage => prevPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (prevPage) {
            fetchCharacters(prevPage)
            setCurrentPage(prevPage => prevPage - 1)
        }
    }

    const handlePageClick = (page: number) => {
        const url = `https://swapi.dev/api/people/?page=${page}`
        fetchCharacters(url)
        setCurrentPage(page)
    }

    const renderStarWarsText = (currentPage: number) => {
        const text = "STARWARS"
        return text.split('').map((char, index) => (
            <span
                key={index}
                className={index === currentPage - 1 ? "text-yellow-400 cursor-pointer" : "cursor-pointer"}
                onClick={() => handlePageClick(index + 1)}
            >
          {char}
        </span>
        ))
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-4">
                <Image
                    src={`${process.env.NODE_ENV === "production" ? "/starwars" : ""}/starwars-logo.webp`}
                    alt="Star Wars Logo"
                    width={150}
                    height={150}
                    className="mb-4  inline"
                />
                🟡🤖⚔️</h1>
            <div className="mb-4 flex">
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search characters..."
                    className="mr-2"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                    <Search/>
                </Button>
            </div>
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 max-h-full h-[calc(100vh-2rem)] md:h-[calc(100vh-6rem)]">
                <div className="h-full flex flex-col">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Characters</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader className="h-8 w-8 animate-spin text-accent"/>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {characters.slice(0, visibleCharacters).map((character) => (
                                <Button
                                    key={character.url}
                                    onClick={() => handleCharacterClick(character)}
                                    className={`group ${selectedCharacter?.url === character.url ? 'bg-yellow-400 text-slate-900' : ''}`}
                                >
                                    <div className="col-span-2">
                                        <p className="font-bold group-hover:text-yellow-400">{character.name}</p>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-grow justify-between mt-4">
                        <Button onClick={handlePrevPage} disabled={!prevPage || isLoading}>
                            <ChevronLeft/>
                        </Button>
                        <div className="flex items-center justify-center text-2xl md:text-7xl font-bold">
                            {renderStarWarsText(currentPage)}
                        </div>
                        <Button onClick={handleNextPage} disabled={!nextPage || isLoading}>
                            <ChevronRight/>
                        </Button>
                    </div>
                </div>
                <div className="relative h-full w-full">
                    {selectedCharacter && (
                        <Card className="border-none h-full w-full bg-transparent relative">
                            <CardHeader>
                                <CardTitle className="text-lg md:text-xl">{selectedCharacter.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="transition-all duration-500 ease-in-out">
                                <Image
                                    src={getImageUrl(selectedCharacter.url)}
                                    alt={selectedCharacter.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{objectFit: 'cover', objectPosition: 'top'}}
                                    className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out rounded-lg"
                                    loading="lazy"
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end p-2 md:p-4 text-white">
                                    <p className="mb-1">Height: {selectedCharacter.height} cm</p>
                                    <p className="mb-1">Mass: {selectedCharacter.mass} kg</p>
                                    <p className="mb-1">Hair Color: {selectedCharacter.hair_color}</p>
                                    <p className="mb-1">Skin Color: {selectedCharacter.skin_color}</p>
                                    <p className="mb-1">Eye Color: {selectedCharacter.eye_color}</p>
                                    <p className="mb-1">Birth Year: {selectedCharacter.birth_year}</p>
                                    <p className="mb-1">Gender: {selectedCharacter.gender}</p>
                                    {details.films.length > 0 && (
                                        <p className="mb-1">Films: {details.films.map((film: Film) => film.title).join(', ')}</p>
                                    )}
                                    {details.vehicles.length > 0 && (
                                        <p className="mb-1">Vehicles: {details.vehicles.map((vehicle: Vehicle) => vehicle.name).join(', ')}</p>
                                    )}
                                    {details.starships.length > 0 && (
                                        <p className="mb-1">Starships: {details.starships.map((starship: Starship) => starship.name).join(', ')}</p>
                                    )}
                                    {details.species.length > 0 && (
                                        <p className="mb-1">Species: {details.species.map((species: Species) => species.name).join(', ')}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}