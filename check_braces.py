
def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stack = []
    for i, line in enumerate(lines):
        line_num = i + 1
        for char in line:
            if char in '({[':
                stack.append((char, line_num))
            elif char in ')}]':
                if not stack:
                    print(f"Error: Unexpected closing '{char}' at line {line_num}")
                    return
                last_char, last_line = stack.pop()
                expected = {'(': ')', '{': '}', '[': ']'}[last_char]
                if char != expected:
                    print(f"Error: Mismatched '{char}' at line {line_num}. Expected '{expected}' to close '{last_char}' from line {last_line}")
                    return

    if stack:
        print("Unclosed braces stack:")
        for char, line_num in stack:
            print(f"  '{char}' from line {line_num}")
    else:
        print("All braces balanced!")

check_braces('app/page.js')
