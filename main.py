board = [
    [7, 8, 0, 4, 0, 0, 1, 2, 0],
    [6, 0, 0, 0, 7, 5, 0, 0, 9],
    [0, 0, 0, 6, 0, 1, 0, 7, 8],
    [0, 0, 7, 0, 4, 0, 2, 6, 0],
    [0, 0, 1, 0, 5, 0, 9, 3, 0],
    [9, 0, 4, 0, 6, 0, 0, 0, 5],
    [0, 7, 0, 3, 0, 0, 0, 1, 2],
    [1, 2, 0, 0, 0, 7, 4, 0, 0],
    [0, 4, 9, 2, 0, 6, 0, 0, 7]
]

def findEmpty(board):
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 0:
                return i, j
    return False

def checkValidNum(board,position,number):
    for i in range(len(board[0])):
        if board[position[0]][i] == number and i != position[1]:
            return False

    for i in range(len(board)):
        if(board[i][position[1]] == number and i != position[0]):
            return False

    columnX = (position[1] // 3) * 3
    columnY = (position[0] // 3) * 3

    for i in range(columnY, columnY + 3):
        for j in range(columnX, columnX + 3):
            if board[i][j] == number and (i, j) != position:
                return False

    return True

def solveSudoku(board):
    if not findEmpty(board):
        return True
    else:
        row, col = findEmpty(board)

    for i in range(1,10):
        if(checkValidNum(board,(row,col),i)):
            board[row][col] = i

            if(solveSudoku(board)):
                return True

            board[row][col] = 0
    return False

def displaySolution(board):
    solveSudoku(board)
    for i in range(0,len(board)):
        if(i % 3 == 0 and i != 0):
            print("-------------------------")
        for j in range(0,len(board[0])):
            if (j % 3 == 0 and j != 0):
                print("|", end="")
            print(str(board[i][j]) + " ",end = "")
        print("")

displaySolution(board)
