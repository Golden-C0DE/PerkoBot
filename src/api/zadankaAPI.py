import requests
from bs4 import BeautifulSoup
from random import choice
import json
import sys


def get_puzzle(details):
    advancedSubjects = {
    '4914.html': 'Liczby, wyrażenia algebraiczne i wzory skróconego mnożenia',
    '4915.html': 'Udowodnij, uzasadnij, wykaż równość lub nierówność',
    '4916.html': 'Funkcja liniowa',
    '4921.html': 'Równania i nierówności z wartością bezwzględną',
    '4918.html': 'Funkcja kwadratowa',
    '4917.html': 'Wzory Viete`a',
    '4919.html': 'Zadania optymalizacyjne z wykorzystaniem maksimum lub minimum funkcji kwadratowej',
    '4920.html': 'Równania i nierówności wielomianowe',
    '4922.html': 'Własności wielomianów',
    '4923.html': 'Udowodnij podzielność',
    '4924.html': 'Funkcja wymierna',
    '4925.html': 'Funkcja logarytmiczna',
    '4926.html': 'Funkcja wykładnicza',
    '4927.html': 'Przekształcenia wykresu funkcji',
    '4928.html': 'Odczytywanie liczby rozwiązań z wykresu funkcji',
    '4929.html': 'Własności ciągów',
    '4930.html': 'Ciąg arytmetyczny i geometryczny',
    '4931.html': 'Szereg geometryczny',
    '4932.html': 'Granica ciągu',
    '5172.html': 'Granica funkcji',
    '4933.html': 'Pochodna funkcji',
    '4934.html': 'Równanie stycznej',
    '4935.html': 'Wzory trygonometryczne',
    '4937.html': 'Równania trygonometryczne',
    '4938.html': 'Wykres funkcji trygonometrycznych',
    '4939.html': 'Figury wpisane i opisane na okręgu',
    '4940.html': 'Twierdzenie sinusów i cosinusów',
    '4941.html': 'Geometria na płaszczyźnie',
    '4942.html': 'Udowodnij, uzasadnij, wykaż własność figury',
    '4943.html': 'Okrąg w układzie współrzędnych',
    '4944.html': 'Obliczenia w układzie współrzędnych',
    '5689.html': 'Wektory',
    '4945.html': 'Graniastosłupy',
    '4946.html': 'Ostrosłupy',
    '4947.html': 'Stożek',
    '4948.html': 'Zadania optymalizacyjne z wykorzystaniem pochodnej',
    '4949.html': 'Kombinatoryka',
    '4950.html': 'Prawdopodobieństwo',
    '4951.html': 'Prawdopodobieństwo warunkowe i całkowite',
    '6840.html': 'Schemat Bernoulliego',
    '4952.html': 'Różne'
    }

    noobSubjects = {
        "zamknięte": {
            '2640.html': 'Procenty',
            '7040.html': 'Kapitalizacja odsetek',
            '2641.html': 'Potęgi i pierwiastki',
            '5048.html': 'Wartość bezwzględna',
            '5866.html': 'Błąd względny i bezwzględny',
            '7094.html': 'Proporcjonalność prosta i odwrotna',
            '2642.html': 'Wyrażenia algebraiczne i wzory skróconego mnożenia',
            '4503.html': 'Własności funkcji',
            '3057.html': 'Przesuwanie wykresu funkcji',
            '3023.html': 'Własności funkcji liniowej na podstawie wzoru',
            '2644.html': 'Własności funkcji liniowej na podstawie wykresu',
            '2649.html': 'Funkcja liniowa z parametrem',
            '2650.html': 'Proste równoległe',
            '7487.html': 'Proste prostopadłe',
            '3022.html': 'Równania i nierówności liniowe',
            '4732.html': 'Układy równań liniowych',
            '2645.html': 'Funkcja kwadratowa',
            '7822.html': 'Praktyczne zastosowanie funkcji kwadratowej',
            '2646.html': 'Równania kwadratowe',
            '2647.html': 'Nierówności kwadratowe',
            '2648.html': 'Równania z iloczynem nawiasów',
            '6564.html': 'Wielomiany',
            '2662.html': 'Funkcja wymierna',
            '2661.html': 'Równania wymierne',
            '4502.html': 'Funkcja wykładnicza',
            '2643.html': 'Logarytmy',
            '2679.html': 'Wzór ciągu',
            '2651.html': 'Ciąg arytmetyczny',
            '2652.html': 'Ciąg geometryczny',
            '7424.html': 'Definicje funkcji trygonometrycznych',
            '2653.html': 'Sin, cos, tg',
            '2654.html': 'Związki pomiędzy funkcjami trygonometrycznymi',
            '3059.html': 'Nierówności, kąty, przekątne figur na płaszczyźnie',
            '2658.html': 'Kąty w okręgu',
            '7821.html': 'Okrąg i koło',
            '2659.html': 'Twierdzenie Pitagorasa',
            '2660.html': 'Podobieństwo figur',
            '2664.html': 'Figury na płaszczyźnie',
            '2671.html': 'Długość i środek odcinka w układzie współrzędnych',
            '6568.html': 'Prosta w układzie współrzędnych',
            '6566.html': 'Okrąg w układzie współrzędnych',
            '6567.html': 'Symetria w układzie współrzędnych',
            '2663.html': 'Liczba wierzchołków, krawędzi brył w przestrzeni',
            '2666.html': 'Sześcian, prostopadłościan',
            '3977.html': 'Graniastosłup, ostrosłup',
            '3060.html': 'Walec, stożek, kula',
            '2657.html': 'Średnia arytmetyczna',
            '3061.html': 'Mediana i dominanta',
            '7041.html': 'Zliczanie liczb',
            '2656.html': 'Reguła mnożenia',
            '2673.html': 'Prawdopodobieństwo',
            '3348.html': 'Różne'
        },

        "otwarte": {
            '3062.html': 'Procenty',
            '3064.html': 'Wyrażenia algebraiczne i wzory skróconego mnożenia',
            '6563.html': 'Dowody podzielności liczb',
            '2669.html': 'Udowodnij, uzasadnij, wykaż',
            '3024.html': 'Własności funkcji na podstawie jej wykresu',
            '3079.html': 'Funkcja liniowa',
            '7093.html': 'Zadania tekstowe',
            '3068.html': 'Własności funkcji kwadratowej',
            '2668.html': 'Nierówności kwadratowe',
            '2677.html': 'Praktyczne zastosowanie funkcji kwadratowej',
            '3070.html': 'Funkcja kwadratowa z parametrem',
            '2672.html': 'Średnia prędkość',
            '5352.html': 'Równania z iloczynem nawiasów',
            '3078.html': 'Równania wymierne',
            '6841.html': 'Funkcja wykładnicza',
            '3075.html': 'Logarytmy',
            '3063.html': 'Wzór ciągu',
            '2670.html': 'Ciąg arytmetyczny',
            '3074.html': 'Ciąg geometryczny',
            '2680.html': 'Trygonometria',
            '2681.html': 'Wykaż na płaszczyźnie',
            '3069.html': 'Figury w okręgu',
            '2682.html': 'Geometria na płaszczyźnie',
            '6839.html': 'Praktyczne zastosowanie funkcji kwadratowej w geometrii',
            '2675.html': 'Obliczenia w układzie współrzędnych',
            '2674.html': 'Graniastosłupy i ostrosłupy',
            '3076.html': 'Walce i stożki',
            '2676.html': 'Kombinatoryka',
            '2678.html': 'Prawdopodobieństwo',
            '3081.html': 'Średnia arytmetyczna',
            '3077.html': 'Mediana i dominanta',
            '3072.html': 'Różne'
        }
    }

    level = "podstawowy"

    if details == "pod":
        type = choice(list(noobSubjects.keys()))
        sidesite, subject = choice(list(noobSubjects[type].items()))
    elif details == "pod-O":
        type = "otwarte"
        sidesite, subject = choice(list(noobSubjects[type].items()))
    elif details == "pod-Z":
        type = "zamknięte"
        sidesite, subject = choice(list(noobSubjects[type].items()))
    else:
        level = "rozszerzony"
        type = "?"
        sidesite, subject = choice(list(advancedSubjects.items()))

    link = f'https://matematykaszkolna.pl/strona/{sidesite}'
    response = requests.get(link)

    soup = BeautifulSoup(response.text, 'html.parser')
    puzzles = soup.select("#listaZadan a")

    puzzle = choice(puzzles)
    website = f'https://matematykaszkolna.pl/strona/{puzzle.get('href')}'

    response = requests.get(website)
    response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, 'html.parser')

    element = soup.select_one("#opis")
    text_node = element.find(string=True, recursive=False)

    text = text_node.strip() if text_node else "Brak"

    return json.dumps({
        "src": website,
        "text": text,
        "subject": subject,
        "level": level,
        "type": type
        })

if __name__ == "__main__":
    d = sys.argv[1] if len(sys.argv) > 1 else "roz"
    print(get_puzzle(d))