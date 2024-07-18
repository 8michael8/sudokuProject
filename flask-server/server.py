from flask import Flask, request, jsonify

app = Flask(__name__)

def findEmpty(board):
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 0:
                return i, j
    return False


def checkValidNum(board, position, number):
    for i in range(len(board[0])):
        if board[position[0]][i] == number and i != position[1]:
            return False

    for i in range(len(board)):
        if board[i][position[1]] == number and i != position[0]:
            return False

    columnX = (position[1] // 3) * 3
    columnY = (position[0] // 3) * 3

    for i in range(columnY, columnY + 3):
        for j in range(columnX, columnX + 3):
            if board[i][j] == number and (i, j) != position:
                return False

    return True


def solveSudoku(board, steps):
    if not findEmpty(board):
        return True
    else:
        row, col = findEmpty(board)

    for i in range(1, 10):
        if checkValidNum(board, (row, col), i):
            board[row][col] = i
            if solveSudoku(board, steps):
                steps.append([row[:] for row in board])  # Record the step
                return True

            board[row][col] = 0
            steps.append([row[:] for row in board])  # Record the step for backtracking

    return False

@app.route("/solve", methods=["POST"])
def solve():
    data = request.get_json()
    board = data.get("board", [])
    steps = []

    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] != 0:
                if checkValidNum(board,(i, j), board[i][j]) == False:
                    return jsonify({"error": "Board cannot be solved"}), 400
    if not board:
        return jsonify({"error": "Invalid board"}), 400

    if solveSudoku(board, steps):
        return jsonify({"steps": steps})
    else:
        return jsonify({"error": "Board cannot be solved"}), 400

if __name__ == "__main__":
    app.run(debug=True)
