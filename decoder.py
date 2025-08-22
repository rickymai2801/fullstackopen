import requests
from bs4 import BeautifulSoup

def decode_message(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    x_max = 0
    y_max = 0
    rows = []
    for row in soup.find_all("tr")[1:]:
        row_cells = [cell.get_text(strip=True) for cell in row.find_all("td")]

        x_coord = int(row_cells[0])
        y_coord = int(row_cells[2])
        if x_coord > x_max:
            x_max = x_coord

        if y_coord > y_max:
            y_max = y_coord
        
        rows.append(row_cells)

    grid = [[' ' for _ in range(x_max + 1)] for _ in range(y_max + 1)]
    for row in rows:
        x_coord = int(row[0])
        y_coord = int(row[2])
        grid[y_coord][x_coord] = row[1]

    for row in grid[::-1]:
       print("".join(row))

decode_message("https://docs.google.com/document/d/e/2PACX-1vRPzbNQcx5UriHSbZ-9vmsTow_R6RRe7eyAU60xIF9Dlz-vaHiHNO2TKgDi7jy4ZpTpNqM7EvEcfr_p/pub")