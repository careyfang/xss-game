from flask import Flask, render_template, request, render_template_string

app = Flask(__name__)

# HTML headers and footers
page_header = """
<!doctype html>
<html>
  <head>
    <!-- Internal game scripts/styles, mostly boring stuff -->
    <script src="/static/game-frame.js"></script>
    <link rel="stylesheet" href="/static/game-frame-styles.css" />
  </head>
  <body id="level1">
    <img src="/static/logos/level1.png">
    <div>
"""

page_footer = """
    </div>
  </body>
</html>
"""

# Main page markup
main_page_markup = """
<form action="" method="GET">
  <input id="query" name="query" value="Enter query here..." onfocus="this.value=''">
  <input id="button" type="submit" value="Search">
</form>
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/level1')
def level1():
    return render_template('level1.html')

@app.route('/level2')
def level2():
    return render_template('level2.html')

@app.route('/level3')
def level3():
    return render_template('level3.html')

@app.route('/level4')
def level4():
    return render_template('level4.html')

@app.route('/level5')
def level5():
    return render_template('level5.html')

@app.route('/level6')
def level6():
    return render_template('level6.html')

@app.route('/level1/frame', methods=['GET'])
def level1_frame():
    # Disable the reflected XSS filter for demonstration purposes
    # Note: Flask doesn't have XSS protection by default, so this line is not needed.

    query = request.args.get('query')
    
    if not query:
        # Show main search page
        content = page_header + main_page_markup + page_footer
    else:
        # Vulnerability: directly use the query parameter without sanitization
        message = f"Sorry, no results were found for <b>{query}</b>."
        message += " <a href='?'>Try again</a>."
        content = page_header + message + page_footer
    
    return render_template_string(content)

@app.route('/level1/source')
def level1_source():
    return render_template('levels/level1/source.html')

@app.route('/level2/source')
def level2_source():
    return render_template('levels/level2/source.html')

@app.route('/level2/frame')
def level2_frame():
    return render_template('levels/level2/frame.html')

@app.route('/level3/source')
def level3_source():
    return render_template('levels/level3/source.html')

@app.route('/level3/frame')
def level3_frame():
    return render_template('levels/level3/frame.html')

@app.route('/level4/source')
def level4_source():
    return render_template('levels/level4/source.html')

@app.route('/level4/frame', methods=['GET'])
def level4_frame():
    timer = request.args.get('timer')
    if not timer:
        # Show the main timer page (frame.html)
        return render_template('levels/level4/frame.html')
    else:
        # Show the timer page (timer.html) with the timer value
        return render_template('timer.html', timer=timer)

@app.route('/level5/source')
def level5_source():
    return render_template('levels/level5/source.html')

@app.route('/level5/frame', methods=['GET'])
def level5_frame():
    return render_template('levels/level5/frame.html')

@app.route('/level5/frame/signup', methods=['GET'])
def level5_frame_signup():
    next_param = request.args.get('next')
    return render_template('signup.html', next=next_param)

@app.route('/level5/frame/confirm', methods=['GET'])
def level5_frame_confirm():
    next_param = request.args.get('next', 'welcome')
    return render_template('confirm.html', next=next_param)

@app.route('/level5/frame/welcome', methods=['GET'])
def level5_frame_welcome():
    return render_template('welcome.html')

@app.route('/level6/source')
def level6_source():
    return render_template('levels/level6/source.html')

@app.route('/level6/frame')
def level6_frame():
    return render_template('levels/level6/frame.html')

if __name__ == '__main__':
    app.run(debug=True)
