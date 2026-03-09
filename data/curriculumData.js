/**
 * Concept Lab — curriculum data.
 *
 * ADDING A NEW NODE:
 *   1. Add an entry to the relevant section array below.
 *   2. That's it. generateStaticParams derives slugs from this array automatically.
 *
 * ADDING A NEW SECTION:
 *   1. Add to `sections`.
 *   2. Create a new node array and spread it into `nodes` at the bottom.
 */

// ─────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────
export const sections = [
  {
    id: "ml",
    title: "Machine Learning",
    description:
      "Supervised learning, linear and logistic regression, gradient descent, cost functions, regularisation, and the full breadth of Andrew Ng's ML Specialisation.",
    order: 1,
  },
  {
    id: "rag",
    title: "RAG Systems",
    description:
      "Retrieval-Augmented Generation: from fundamentals (tokens, embeddings, vector DBs) to chunking strategies, multi-query, hybrid search, and reranking.",
    order: 2,
  },
  {
    id: "langchain",
    title: "LangChain",
    description:
      "Building LLM-powered applications with LangChain: chat models, prompt templates, chains, memory, and connecting to real data sources.",
    order: 3,
  },
  {
    id: "advanced",
    title: "Advanced ML",
    description:
      "Advanced algorithms and deeper dives — neural networks, decision trees, ensemble methods. Content grows as you learn.",
    order: 4,
  },
];

// ─────────────────────────────────────────────────────────
// NODES — Machine Learning (39 sessions from Andrew Ng)
// ─────────────────────────────────────────────────────────
const mlNodes = [
  {
    slug: "01-intro-to-ml",
    sectionId: "ml",
    title: "Introduction to Machine Learning",
    order: 1,
    excerpt: "What ML is, where you already use it daily, and why this matters.",
    theory: "<p><b>Machine Learning</b> is the science of getting computers to learn from data, rather than following rules a human explicitly wrote.</p><p><b>The key insight:</b> Instead of a programmer writing 'if the email contains &quot;free money&quot; then mark it as spam', an ML model reads thousands of real spam emails, finds the patterns itself, and learns a far better filter than any human could write by hand.</p><p><b>Arthur Samuel's definition (1959):</b> 'The field of study that gives computers the ability to learn without being explicitly programmed.' Still the clearest definition 65 years later.</p><p><b>You use it daily without knowing:</b></p><ul><li>Google Search — ranking is learned from billions of clicks, not hand-tuned rules</li><li>Netflix — recommendations learned from what 260M subscribers watched next</li><li>Email spam filter — trained on millions of labelled spam/not-spam examples</li><li>Google Photos — recognises your face from a single example photo</li><li>Voice assistants — speech recognition improved from zero hand-written rules</li></ul><p><b>Why this matters:</b> ML systems improve automatically as more data arrives. Rule-based systems require manual updates for every new edge case. At scale, ML is the only approach that works.</p>",
    example: "When you search 'how to make sushi', Google surfaces the best pages not because a human manually ranked them — an ML model learned which pages satisfy users most from billions of past clicks, dwell time, and engagement signals. Change the rules by hand? Impossible. Let the model learn? It updates itself every day.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is machine learning? How does it differ from traditional programming?",
        "Give three real-world examples of ML in products you use daily.",
        "Who coined the term machine learning and when?",
      ],
      seniorTip: "Don't just define it — anchor the definition to business value. 'ML lets us build systems that improve with data, which scales infinitely whereas manually written rules do not.' That shows you think about production impact, not just theory."
    },
    flashCards: [
      {
        q: "How does ML differ from traditional programming — give a simple mental model.",
        a: "Traditional: You write rules → machine executes them. ML: You provide data + correct answers → machine learns the rules itself. The intelligence lives in the data, not the code."
      },
      {
        q: "Who coined the term 'Machine Learning' and when?",
        a: "Arthur Samuel in 1959. He defined it as 'the field of study that gives computers the ability to learn without being explicitly programmed.'"
      },
      {
        q: "Name four everyday products that use ML under the hood.",
        a: "1. Email spam filter  2. Netflix / Spotify recommendations  3. Google Search ranking  4. Google Photos face recognition. Nearly every digital product you use daily has ML powering a key feature."
      },
      {
        q: "Why can't we just write rules for tasks like speech recognition?",
        a: "The rules are impossibly complex and too numerous to articulate manually. A human can't describe the acoustic patterns that make 'cat' sound different from 'kit'. Only a model trained on millions of examples can discover those patterns."
      },
      {
        q: "What is the scaling advantage of ML over rule-based systems?",
        a: "ML systems improve automatically as more data arrives — you don't rewrite code. Rule-based systems require manual updates for every new edge case, which becomes unmanageable at scale."
      },
    ],
  },
  {
    slug: "02-why-ml-matters",
    sectionId: "ml",
    title: "Why Machine Learning Matters",
    order: 2,
    excerpt: "ML as the dominant path to AI; the $13-trillion opportunity ahead.",
    theory: "<p>Traditional programming works for tasks where we can write the rules — like GPS routing. But for <b>speech recognition, disease diagnosis, or self-driving cars</b>, we simply don't know how to write those rules by hand. The only approach that works is to let machines learn from data.</p><p>As Andrew Ng explained in the lecture: there are basic things we could program a machine to do, like finding the shortest path from A to B. But <b>\'for the most part, we just did not know how to write an explicit program\'</b> to do the interesting things — web search, speech recognition, medical diagnosis.</p><p>Why does this matter economically? A McKinsey study estimates ML will create an additional <b>$13 trillion in annual economic value by 2030</b>. The biggest gains are still untapped outside software — in retail, healthcare, agriculture, and manufacturing. The demand far outstrips the supply of ML practitioners today.</p><p>The long-term goal of AI research is <b>AGI</b> (Artificial General Intelligence) — machines as intelligent as humans. Most researchers believe learning algorithms are the best known path, even if it takes 50 or 500 years.</p>",
    example: "Andrew Ng founded and led Google Brain (speech recognition, Street View image analysis), led AI at Baidu (augmented reality, fraud detection, self-driving), and now works on AI for factories, agriculture, and healthcare at Landing AI. The common thread: every breakthrough required machines to learn from data — no one hand-coded those systems.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why can't we just hand-code rules for speech recognition or disease diagnosis?",
        "What is AGI and why do most researchers think learning algorithms are the path to it?",
        "Where is the largest untapped economic value from ML — inside or outside the software industry?",
      ],
      seniorTip: "Connect this to your own projects: 'We chose ML over rule-based because the feature space had 500+ dimensions — no human could enumerate the relevant combinations. ML discovered them automatically from data.' That shows you apply the insight, not just recite it."
    },
    flashCards: [
      {
        q: "Why is ML required for tasks like speech recognition — can't we just write rules?",
        a: "No. The rules are impossibly complex. No human can articulate the acoustic patterns that distinguish 'cat' from 'kit' across accents, microphones, and noise. Only a model trained on millions of examples can discover those patterns automatically."
      },
      {
        q: "How much annual economic value does McKinsey estimate ML will create by 2030?",
        a: "$13 trillion. And most of it is still untapped — the largest opportunities are outside software, in healthcare, agriculture, manufacturing, and retail. That's why this is the best time to learn ML."
      },
      {
        q: "What is AGI and how does it relate to ML?",
        a: "AGI = Artificial General Intelligence — machines as intelligent as humans. Most researchers believe learning algorithms (inspired by how the brain works) are the best path to get there, even if it takes 50–500 years. Current ML is 'narrow AI' — expert at specific tasks."
      },
    ],
  },
  {
    slug: "03-ml-definition-types",
    sectionId: "ml",
    title: "ML Definition & Types",
    order: 3,
    excerpt: "Supervised, unsupervised, and reinforcement learning — when to use each.",
    theory: "<p>Three main paradigms:</p><ul><li><b>Supervised Learning</b> — learns from labelled examples (input → output pairs). Most commercially used. Covers Regression (continuous output) and Classification (discrete categories).</li><li><b>Unsupervised Learning</b> — finds hidden patterns in unlabelled data. Clustering, dimensionality reduction, anomaly detection. After supervised learning, the most widely used form.</li><li><b>Reinforcement Learning</b> — an agent learns by interacting with an environment and receiving rewards. Used in game AI and robotics.</li></ul>",
    example: "Supervised: email spam detection (label = spam/not). Unsupervised: customer segmentation with no pre-defined groups. RL: AlphaGo learning to beat world champions at chess through millions of self-play games.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is the difference between supervised and unsupervised learning?",
        "When would you choose unsupervised over supervised learning?",
        "Name two real-world applications of each paradigm.",
      ],
      seniorTip: "A senior answer goes beyond definitions: 'Supervised is your first choice because you can measure performance with labelled test data. You fall back to unsupervised when labels are too expensive or unavailable, accepting that evaluation becomes qualitative.' Also mention semi-supervised learning — using a small labelled set with a large unlabelled set."
    },
    flashCards: [
      {
        q: "What are the three main ML paradigms? One sentence each.",
        a: "Supervised: learns from labelled (X→Y) pairs. Unsupervised: finds hidden structure in data with no labels. Reinforcement: an agent learns by taking actions and receiving rewards from an environment."
      },
      {
        q: "Supervised learning has two sub-types. What are they?",
        a: "Regression — output is a continuous number (e.g. house price = $450K). Classification — output is a discrete category (e.g. email = spam or not spam)."
      },
      {
        q: "Give a real product example of unsupervised clustering.",
        a: "Google News groups articles about the same event from hundreds of different sources — no human labelled which articles belong together. The algorithm discovers the clusters by text similarity."
      },
      {
        q: "When would you prefer unsupervised learning over supervised?",
        a: "When you have no labels (or labels are too expensive to obtain). E.g. discovering unknown customer segments, finding new fraud patterns, or exploring data before you know what questions to ask."
      },
      {
        q: "What is semi-supervised learning and why does it matter in practice?",
        a: "Uses a small labelled set + a large unlabelled set together. Crucial in production because labelling data is expensive — many real ML systems get supervised-level performance with far fewer manual labels."
      },
    ],
  },
  {
    slug: "04-supervised-regression",
    sectionId: "ml",
    title: "Supervised Learning — Regression",
    order: 4,
    excerpt: "Predicting continuous output values — the engine behind 99% of ML's economic value.",
    theory: "<p>Andrew Ng made a striking claim in this lecture: <b>'I think 99% of the economic value created by machine learning today is through one type — supervised learning.'</b></p><p><b>Supervised learning</b> means you give the algorithm examples with the correct answers (input X → output Y pairs). It learns the mapping. Then you give it a new X it has never seen and it predicts Y.</p><p>Two sub-types exist. <b>Regression</b> is when the output Y is a continuous number — any value on a scale. Examples from the lecture:</p><ul><li>House price prediction: input = size in sq ft → output = price in dollars (e.g. $150,000 or $340,000)</li><li>Advertising click probability: input = [ad features, user features] → output = probability of click (a number)</li><li>Speech-to-text: input = audio clip → output = text transcript</li></ul><p>The key insight: the model doesn't output a category — it outputs <b>a specific number from an infinite range of possible values</b>.</p>",
    example: "The house price dataset from Portland: you have hundreds of past sales. Each sale is [size in sq ft] → [price in $K]. You train a linear regression model on these. Now a client has a 1,250 sq ft house — the model predicts ~$250K by finding the best-fit line through the training data.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is supervised learning? What makes it 'supervised'?",
        "What is the difference between regression and classification in supervised learning?",
        "Name three real-world supervised regression problems.",
      ],
      seniorTip: "Anchor the answer to what 'supervised' actually means: 'We provide ground truth labels (correct answers) at training time. The model optimises its parameters so that its predictions match those labels. At inference time, there are no labels — the model must generalise from what it learned.' That shows you understand the training/inference distinction, which matters in production."
    },
    flashCards: [
      {
        q: "What makes supervised learning 'supervised'?",
        a: "You give the algorithm labelled examples — input X paired with the correct output Y. The algorithm learns the X→Y mapping from those correct answers. Andrew Ng: 'You give your learning algorithm examples to learn from that include the right answers.'"
      },
      {
        q: "What is regression in supervised learning?",
        a: "Regression predicts a continuous number — any value from an infinite range. Example: house price ($150K, $250K, $340K). The output is a specific number on a scale, not a category."
      },
      {
        q: "Andrew Ng's striking stat about supervised learning — what is it?",
        a: "'99% of the economic value created by machine learning today is through supervised learning.' This is why it's the first thing to learn — it drives ads, recommendations, fraud detection, and pricing systems."
      },
      {
        q: "What is the most lucrative supervised learning application today?",
        a: "Online advertising. A model takes [ad features + user features] → outputs 'will this user click?'. Every additional click is revenue. Major platforms run these models on billions of ad impressions per day."
      },
    ],
  },
  {
    slug: "05-classification",
    sectionId: "ml",
    title: "Supervised Learning — Classification",
    order: 5,
    excerpt: "Predicting discrete categories rather than continuous values.",
    theory: "<p><b>Classification</b> predicts which of a finite set of categories an input belongs to. The output is a class label, not a number.</p><ul><li><b>Binary classification</b>: two classes — spam/not spam, malignant/benign, yes/no</li><li><b>Multi-class classification</b>: many classes — digit 0–9, dog breed, disease type A/B/C/D</li></ul><p>The key question: 'Which bucket does this input belong to?' The boundary the model learns between classes is called the <b>decision boundary</b>.</p>",
    example: "Tumour classification: features = [size, texture, age]. Output = malignant (1) or benign (0). The model draws a boundary in feature space — tumours on one side are flagged as malignant.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is the key difference between regression and classification?",
        "What is a decision boundary? Give an example.",
        "Why can't you use linear regression for a classification problem?",
      ],
      seniorTip: "The real answer isn't just 'regression = number, classification = category'. A senior frames it as: 'The choice determines your loss function (MSE for regression, cross-entropy for classification), your activation function, and how you evaluate the model. Getting this wrong means you're optimising for the wrong thing.' This shows you think end-to-end, not just in definitions."
    },
    flashCards: [
      {
        q: "What is the key difference between regression and classification?",
        a: "Regression predicts a continuous number (e.g. price = $450,000). Classification predicts a discrete category (e.g. is this email spam? Yes or No). The output type drives everything else — model choice, loss function, evaluation metric."
      },
      {
        q: "What is binary vs. multi-class classification?",
        a: "Binary = exactly two outputs (spam/not, fraud/legit, tumour/benign). Multi-class = three or more outputs (digit 0–9, disease type A/B/C/D, dog breed classifier with 120 classes)."
      },
      {
        q: "What is a decision boundary?",
        a: "The line (or surface in higher dimensions) that the model draws in feature space to separate classes. Points on one side → class A, points on the other side → class B. For logistic regression, this is a straight line (linear boundary)."
      },
      {
        q: "Why can't you use linear regression for classification?",
        a: "Linear regression outputs any real number. For classification you need probabilities in [0,1]. Linear regression can predict values like -2.3 or 1.8, which have no meaning as probabilities. Use logistic regression or a dedicated classifier instead."
      },
    ],
  },
  {
    slug: "06-unsupervised-learning",
    sectionId: "ml",
    title: "Unsupervised Learning",
    order: 6,
    excerpt: "Finding hidden structure in data with no labels — clustering, anomaly detection, and more.",
    theory: "<p>Andrew Ng's framing: <b>'Don't let the name fool you — unsupervised learning is just as super as supervised learning.'</b></p><p>In unsupervised learning, your dataset has <b>no output labels Y</b> — just input features X. You're not trying to predict anything specific. Instead, the algorithm must discover hidden structure, patterns, or groupings all by itself.</p><p>The most common type is <b>clustering</b> — grouping similar data points together. Real example from the lecture: Google News. Every day, thousands of news articles are published. Google News groups stories about the same event across hundreds of different sources — no human manually labels which articles belong together. The clustering algorithm discovers the groups by text similarity.</p><p>Another example from the lecture: DNA microarray data — researchers measure gene activity across thousands of people and cluster them to discover which individuals share similar genetic patterns. No one told the algorithm what to look for.</p><p>Other unsupervised types you'll learn later: <b>anomaly detection</b> (fraud detection) and <b>dimensionality reduction</b> (compressing data while preserving structure).</p>",
    example: "Google News uses unsupervised clustering to group stories about the same event from hundreds of different news sources — no one manually labelled which articles go together.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is unsupervised learning — how does it differ from supervised?",
        "Name three real-world applications of clustering.",
        "How does Google News use unsupervised learning?",
      ],
      seniorTip: "Andrew Ng's framing is interview gold: 'In supervised learning, every example has a label Y. In unsupervised, there are no Y labels — the algorithm must discover structure itself.' Then add: 'In practice, most production ML is supervised because you can measure performance with labelled test data. Unsupervised is used when labelling is too expensive, impossible, or when you're exploring a new domain and don't yet know what questions to ask.'"
    },
    flashCards: [
      {
        q: "What is the core difference between supervised and unsupervised learning?",
        a: "Supervised: every training example has both input X and output label Y. You tell the algorithm the right answers. Unsupervised: data has only X — no labels. The algorithm must find structure, patterns, or groupings by itself. Andrew Ng: 'We're not trying to supervise the algorithm to give some right answer for every input.'"
      },
      {
        q: "How does Google News use unsupervised clustering?",
        a: "Every day, thousands of news articles are published. Google News clusters stories about the same event from hundreds of different sources — no human labels which articles belong together. The clustering algorithm discovers the groups by text similarity alone. This scales to thousands of new stories daily, impossible to label manually."
      },
      {
        q: "Andrew Ng used a DNA microarray example — what did it demonstrate?",
        a: "Researchers measure gene activity levels across thousands of people. Unsupervised clustering groups individuals by similar gene expression patterns — discovering biological subtypes no one knew existed. The key: no one told the algorithm what patterns to find. It discovered them."
      },
      {
        q: "Why is Google News clustering classified as unsupervised learning?",
        a: "No human ever labelled which articles belong to the same story group. The algorithm receives raw article text (X) with no labels (Y) and discovers the groupings itself. The output categories are emergent — they weren't predefined. This is the defining characteristic of unsupervised learning."
      },
    ],
  },
  {
    slug: "07-unsupervised-anomaly",
    sectionId: "ml",
    title: "Unsupervised — Anomaly Detection",
    order: 7,
    excerpt: "Detecting fraud, defects, and outliers — the three types of unsupervised learning.",
    theory: "<p>This lecture formally defined all three unsupervised learning types. In unsupervised learning, data has inputs X but <b>no output labels Y</b>. The algorithm finds structure on its own.</p><p><b>Three unsupervised learning types from the lecture:</b></p><ul><li><b>Clustering</b> (already covered): group similar data points. Used in Google News grouping news stories, customer segmentation, gene expression analysis.</li><li><b>Anomaly Detection</b>: learn what 'normal' looks like, then flag anything that deviates. Critical use case: <b>fraud detection in the financial system</b> — Andrew Ng's exact words. Unusual transactions could be signs of fraud. Also used in manufacturing quality control to detect defective products.</li><li><b>Dimensionality Reduction</b>: 'take a big dataset and almost magically compress it to a much smaller dataset while losing as little information as possible' — Andrew Ng's description. Used to visualise high-dimensional data, speed up ML training, and remove noise.</li></ul>",
    example: "Credit card fraud: model trains on millions of normal transactions and learns what 'normal spending' looks like (grocery on Tuesdays, coffee daily, occasional online purchase). A $2,000 charge in a foreign country at 3am deviates from that learned pattern — flagged as anomalous, even if this specific fraud pattern was never seen before.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is anomaly detection and when would you use it instead of a supervised classifier?",
        "What is dimensionality reduction used for — give two examples.",
        "Name all three types of unsupervised learning.",
      ],
      seniorTip: "In production, fraud detection is often semi-supervised: you have some labelled fraud examples but they're rare. Senior answer: 'Pure anomaly detection works when fraud patterns change constantly and labels arrive too slowly. But when you have even a few hundred confirmed fraud labels, a hybrid approach — anomaly detection to find candidates, supervised model to confirm — outperforms either alone.'"
    },
    flashCards: [
      {
        q: "What are the three types of unsupervised learning? One sentence each.",
        a: "1. Clustering: group similar data points (K-means, Google News). 2. Anomaly Detection: learn normal patterns, flag deviations (fraud detection). 3. Dimensionality Reduction: compress data while preserving structure (PCA, t-SNE for visualisation)."
      },
      {
        q: "Why is fraud detection considered unsupervised?",
        a: "Fraud patterns constantly evolve — new fraud types appear before they can be labelled. By learning what 'normal' transactions look like, the model flags anything unusual without needing explicit fraud labels. Labels help (semi-supervised), but the core signal is anomalousness."
      },
      {
        q: "What does dimensionality reduction actually do — Andrew Ng's description?",
        a: "'Take a big dataset and almost magically compress it to a much smaller dataset while losing as little information as possible.' Like compressing a 1000-dim embedding to 50 dims — the essential semantic structure is preserved, noise is removed."
      },
    ],
  },
  {
    slug: "08-jupyter-labs",
    sectionId: "ml",
    title: "Jupyter Labs & Dev Environment",
    order: 8,
    excerpt: "The industry-standard ML environment — the exact same tool used at Google, Meta, and Amazon.",
    theory: "<p>Andrew Ng made a key point: <b>'This is the exact same environments, the exact same tool, the Jupyter Notebook, that developers are using in many large countries right now.'</b> It's not a simplified educational environment — it's the actual tool professionals use daily.</p><p>Jupyter Notebooks let you mix <b>code, output, visualisations, and documentation</b> in one document. Each cell runs independently, so you can experiment step by step and see results immediately. This is how ML practitioners explore data, prototype models, and share results.</p><p>Two types of labs in this course:</p><ul><li><b>Optional Labs</b>: pre-written code you run top to bottom. No need to write anything — just run and observe how ML code looks and behaves.</li><li><b>Practice Labs</b>: you write the code yourself. The real learning happens here.</li></ul><p>In industry, Jupyter is where data science happens: EDA (Exploratory Data Analysis), feature engineering, model prototyping, and communicating results to stakeholders.</p>",
    example: "A typical ML workflow in Jupyter: Cell 1 — import libraries → Cell 2 — load data and print shape → Cell 3 — plot data distribution → Cell 4 — define model → Cell 5 — train it → Cell 6 — plot the loss curve → Cell 7 — evaluate on test set. Each step is visible and independently runnable — perfect for iteration and debugging.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is Jupyter Notebook and why is it the standard tool for ML?",
        "What is the difference between a notebook and production Python code?",
      ],
      seniorTip: "Interviewers at senior level know Jupyter is for exploration, not production. Show you know the distinction: 'I use notebooks for EDA, feature engineering, and model iteration. Once I have a working approach, I refactor the logic to modular Python scripts and ML pipelines (Airflow, Kubeflow, MLflow) for production. Notebooks in production are a maintenance nightmare — no version control, no unit tests, hidden state.'"
    },
    flashCards: [
      {
        q: "What is Jupyter Notebook and who uses it?",
        a: "The industry-standard environment for ML and data science. Mixes code, output, charts, and markdown in one document. Used by researchers at Google, Meta, Amazon, and most ML teams worldwide. Andrew Ng: 'This is the exact same tool that developers are using in many large companies right now.'"
      },
      {
        q: "When should you use Jupyter Notebook vs. Python scripts in production?",
        a: "Notebook: exploration, EDA, prototyping, visualisation, sharing results with stakeholders. Python script/module: production code, unit-testable functions, scheduled jobs, reproducible ML pipelines. Converting notebook logic to clean, modular, tested Python is a key senior engineering skill."
      },
    ],
  },
  {
    slug: "09-linear-regression-pipeline",
    sectionId: "ml",
    title: "Linear Regression Pipeline",
    order: 9,
    excerpt: "Your first supervised learning model — probably the most widely used ML algorithm in the world.",
    theory: "<p>Andrew Ng's claim: <b>Linear regression is 'probably the most widely used learning algorithm in the world today'</b>. It's the foundation everything else builds on.</p><p>The problem from the lecture: you want to predict house prices in Portland, Oregon. The dataset has houses with sizes (sq ft) vs. their sale prices ($K). Plot them: horizontal axis = size, vertical axis = price. Each cross is a real sold house.</p><p>The model fits a straight line through those crosses. When a client asks 'how much can I get for my 1,250 sq ft house?', you trace 1,250 up to the line and read off the prediction — approximately $300K.</p><p><b>Key vocabulary from this lecture:</b></p><ul><li><b>Training set</b>: the dataset you use to train the model</li><li><b>Input feature (x)</b>: the variable you use for prediction (house size)</li><li><b>Output target (y)</b>: the value you're trying to predict (house price)</li><li><b>m</b>: number of training examples in the dataset</li><li><b>Training example (x⁽ⁱ⁾, y⁽ⁱ⁾)</b>: the i-th row in the training set</li></ul>",
    example: "Portland housing dataset: you plot 50 past house sales. The model fits a best-fit line. A 1,250 sq ft house traces to ~$300K on that line. That prediction comes from generalising the learned pattern — not from looking up that specific size in the data.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What does the notation x⁽ⁱ⁾ and y⁽ⁱ⁾ mean in ML?",
        "Why is linear regression still important to learn even if you use neural networks?",
        "What is m in the context of a training set?",
      ],
      seniorTip: "Linear regression is the entry point — the concepts introduced here (training set, features, targets, cost function, gradient descent) are used in every ML model. Knowing linear regression deeply means you can explain the fundamentals clearly in any interview, even when you're actually building neural networks in your day job."
    },
    flashCards: [
      {
        q: "What does x⁽ⁱ⁾ ('x superscript i') denote in ML notation?",
        a: "The i-th training example's input feature value. If i=3, x⁽³⁾ is the size of the 3rd house in the training set. Similarly, y⁽³⁾ is the actual sale price of that 3rd house. This notation appears in every ML formula."
      },
      {
        q: "What is m in ML notation?",
        a: "m is the total number of training examples (rows in the dataset). If you have 500 past house sales, m = 500. It appears in the cost function formula: (1/2m) × Σ errors²."
      },
      {
        q: "Why is linear regression called the foundation of ML?",
        a: "It introduces the three-component structure that every ML model uses: 1) A model f(x) with parameters to learn. 2) A cost function J(w,b) measuring how wrong the model is. 3) An optimisation algorithm (gradient descent) to minimise J. Neural networks use exactly this same structure."
      },
    ],
  },
  {
    slug: "10-supervised-pipeline-model",
    sectionId: "ml",
    title: "The Supervised Learning Pipeline",
    order: 10,
    excerpt: "How supervised learning actually works end-to-end — training set in, function out.",
    theory: "<p>This lecture formalised the supervised learning pipeline with precise vocabulary used in every ML paper and interview.</p><p><b>The pipeline, step by step:</b></p><ol><li><b>Training Set</b> → fed to the learning algorithm (both features X and targets Y)</li><li>Algorithm outputs a <b>function f</b> — historically called the 'hypothesis', Andrew Ng calls it simply 'f'</li><li>Given a new input x, f produces <b>ŷ</b> (y-hat) — the prediction</li></ol><p><b>Key vocabulary from the lecture:</b></p><ul><li><b>f (the model)</b>: the function that maps inputs to predictions</li><li><b>x (input feature)</b>: what you feed the model at inference time</li><li><b>y (output target)</b>: the true correct answer from the training data</li><li><b>ŷ (y-hat)</b>: what the model predicts — may or may not equal y</li></ul><p><b>The key design question</b>: how do you represent f? For linear regression: f(x) = wx + b. This is a straight line. But the same framework — choose f, measure wrongness, optimise — applies to neural networks with millions of parameters.</p>",
    example: "Andrew Ng's framing: 'The job of f is to take a new input x and output an estimate or prediction, which I'm going to call y-hat.' For the house price problem: x = house size (1,250 sq ft) → f(x) = w × 1250 + b → ŷ = $300K (predicted price). The true y is the actual sale price — you only know this in training, not at prediction time.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is the difference between y and ŷ in ML?",
        "What does the model f represent — and why is the choice of f important?",
        "Why was the model historically called the 'hypothesis'?",
      ],
      seniorTip: "The choice of f is the most consequential decision in ML. Senior answer: 'f encodes your inductive bias — the assumption you bake in about the shape of the relationship. Linear f assumes a straight line. If the true relationship is more complex, a linear f will systematically underfit. Deep neural networks learn the shape of f from data, which is why they generalise across so many domains.'"
    },
    flashCards: [
      {
        q: "In the supervised learning pipeline, what does the algorithm actually output?",
        a: "A function f. During training, you feed in the training set (X and Y). The algorithm finds the best f — the one whose predictions ŷ = f(x) are closest to the true targets y. At inference time, you only give f a new x and it predicts ŷ."
      },
      {
        q: "What is ŷ (y-hat) and how does it differ from y?",
        a: "ŷ is the model's prediction for a given input. y is the actual true target value (from the training data). Goal of training: minimise the gap between ŷ and y across all training examples. At inference time, y is unknown — that's the whole point."
      },
      {
        q: "What is f(x) = wx + b for linear regression?",
        a: "The model function. w = slope (how much ŷ changes per unit increase in x). b = y-intercept (base value when x=0). Training finds the w and b that make the line pass closest to all the training data points."
      },
    ],
  },
  {
    slug: "11-cost-function",
    sectionId: "ml",
    title: "Cost Function",
    order: 11,
    excerpt: "Measuring how wrong your model is — Mean Squared Error (MSE) explained.",
    theory: "<p>The <b>cost function</b> (also called loss function) answers the question: <em>'How wrong is my model right now?'</em></p><p>It distils the model's performance on all training examples into a single number. The goal of training is to find the parameters (w, b) that make this number as small as possible.</p><p><b>Mean Squared Error (MSE) for linear regression:</b></p><p><code>J(w,b) = (1/2m) × Σ (ŷᵢ − yᵢ)²</code></p><p>Breaking this down step by step:</p><ul><li><b>ŷᵢ − yᵢ</b>: the error for one training example (prediction minus true value)</li><li><b>(ŷᵢ − yᵢ)²</b>: squaring makes the error always positive and punishes large mistakes harder</li><li><b>Σ ...</b>: sum the squared errors for all m training examples</li><li><b>(1/2m)</b>: average over m examples; the ½ is a calculus convenience that cancels the 2 from the derivative</li></ul><p><b>Intuition:</b> If the model predicts house prices perfectly for every example, J = 0. The worse the predictions, the higher J climbs. Training is the process of making J as close to 0 as possible.</p><p><b>Why square errors?</b> Two reasons: (1) negative and positive errors don't cancel each other out, and (2) large errors get penalised much more heavily than small ones — a prediction that's off by 10 contributes 100 to the cost, while being off by 1 contributes only 1.</p>",
    example: "Model predicts house prices [300K, 400K, 500K]. True prices are [280K, 420K, 480K]. MSE = average of [(20K)², (20K)², (20K)²] / 2 = single 'wrongness' score to minimise.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is a cost function? Why do we square the errors?",
        "What is the difference between MSE and MAE (Mean Absolute Error)?",
        "Why does the cost function formula have a 1/2 factor?",
      ],
      seniorTip: "Squaring errors does two things: makes negatives positive, and heavily penalises large errors more than small ones (a 10-unit error gives 100 vs 10 in MAE). The senior insight: 'This is why MSE is sensitive to outliers. If your data has extreme values, MAE or Huber loss are more robust alternatives.'"
    },
    flashCards: [
      {
        q: "What is a cost function (a.k.a. loss function) in ML?",
        a: "A single number that measures how wrong the model's predictions are across all training examples. Training = finding parameters that minimise this number. Think of it as the model's 'score on wrongness'."
      },
      {
        q: "Write the MSE (Mean Squared Error) formula.",
        a: "J(w,b) = (1/2m) × Σ(ŷᵢ − yᵢ)²   Where: m = number of training examples, ŷᵢ = model prediction, yᵢ = true label. The ½ is a convenience — it cancels the 2 from the derivative during gradient descent."
      },
      {
        q: "Why do we square the errors instead of just summing them?",
        a: "Two reasons: (1) Squaring makes negative errors positive — otherwise positive and negative errors cancel out and you'd think the model is perfect when it isn't. (2) Squaring heavily penalises large errors more than small ones (error of 10 → penalty of 100 in MSE vs. 10 in MAE)."
      },
      {
        q: "MSE vs. MAE — when would you prefer each?",
        a: "MSE is standard and differentiable everywhere (good for gradient descent). But it's sensitive to outliers — a single extreme error dominates the loss. MAE is more robust to outliers. Huber loss is a compromise: MSE-like for small errors, MAE-like for large ones."
      },
      {
        q: "What does 'minimising the cost function' actually mean?",
        a: "Finding the values of (w, b) that produce predictions ŷ as close as possible to the true labels y across the entire training set. The algorithm (gradient descent) searches this parameter space to find that minimum."
      },
    ],
  },
  {
    slug: "12-cost-function-intuition",
    sectionId: "ml",
    title: "Cost Function Intuition",
    order: 12,
    excerpt: "What the cost function looks like — and why the bowl shape matters.",
    theory: "<p>This lecture built intuition for the cost function by simplifying to <b>one parameter (w only, b=0)</b>. This lets us plot J as a 2D curve instead of a 3D surface.</p><p>With just w, f(x) = w·x. For different values of w:</p><ul><li>w=1: predicts y=x — if data follows y≈x, cost J is low</li><li>w=0.5: predicts half of x — error is higher, J is higher</li><li>w=0: predicts 0 for everything — worst possible, J is very high</li></ul><p>Plot w on the x-axis and J on the y-axis: you get a <b>U-shaped (parabolic) curve</b>. The minimum of this U is the best value of w.</p><p>For linear regression with MSE, this curve is always <b>convex</b> — one global minimum, no local minima to get stuck in. Andrew Ng: 'The squared error cost function for linear regression always has this U-shaped bowl.' This is mathematically guaranteed and is a key advantage over other cost functions.</p>",
    example: "From the lecture: set b=0. Try w=1 — line passes through the data points perfectly, J≈0. Try w=0.5 — the line is less steep, predictions miss many points, J is higher. Try w=0 — a flat horizontal line, terrible fit, J is highest. Plot these (w, J) pairs: you get the U-shape. Minimum is at w=1.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What shape is the cost function surface for linear regression with MSE, and why does that matter?",
        "Why do we use MSE specifically for linear regression?",
      ],
      seniorTip: "Convexity is the mathematical guarantee that gradient descent will always find the global minimum for linear regression — not just a local one. This is why linear regression is so reliable. Neural networks have non-convex cost functions with many local minima, which is why training them is harder and results can vary between runs."
    },
    flashCards: [
      {
        q: "What shape is the cost function surface for linear regression + MSE?",
        a: "A convex bowl (U-shape in 2D, soup bowl in 3D). There is exactly one global minimum — no local minima to get stuck in. Andrew Ng: 'The squared error cost function for linear regression always has this bowl-shaped surface.' This is mathematically guaranteed."
      },
      {
        q: "Why does convexity of the cost function matter for training?",
        a: "A convex cost function guarantees gradient descent will always find the global minimum — regardless of where you start. Non-convex functions (neural networks) have many local minima, so the starting point and learning rate matter much more. Convexity = guaranteed convergence to the best solution."
      },
      {
        q: "What happens to the J(w) curve when you increase w far above the optimal value?",
        a: "J increases steeply. The parabolic curve rises sharply on both sides of the minimum. Far from the optimal w, the model's predictions are way off for every training example, so the sum of squared errors grows very large."
      },
    ],
  },
  {
    slug: "13-cost-visualisation-3d",
    sectionId: "ml",
    title: "Cost Visualisation in 3D",
    order: 13,
    excerpt: "Contour plots and the 3D bowl — seeing the optimisation landscape with two parameters.",
    theory: "<p>Once we restore the b parameter, J becomes J(w, b) — a function of two parameters. We can no longer draw a 2D curve. Instead, we get:</p><p><b>3D Surface Plot:</b> w on one horizontal axis, b on the other, J on the vertical axis. The result is a 3D bowl shape — like a soup bowl. The bottom of the bowl is the minimum J — the best (w, b).</p><p>Andrew Ng's example: w=0.06, b=50 creates a line that consistently underestimates house prices. On the 3D surface, this corresponds to a point far from the minimum — high up on the bowl's wall.</p><p><b>Contour Plot:</b> The same bowl viewed from directly above. Each oval/ellipse represents all (w, b) combinations that produce the <b>same cost J</b> — like altitude lines on a topographic map. The smallest inner oval = the minimum (best model). Moving from the outer ovals toward the centre = training (reducing cost).</p>",
    example: "On the contour plot: a point at w=-0.15, b=800 is far from the minimum — on an outer oval. The line f(x) = -0.15x + 800 has a negative slope and high intercept, badly fitting the housing data. As gradient descent runs, the (w, b) point spirals inward on the contour plot toward the centre minimum.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What does a contour plot of the cost function show?",
        "What does the centre of the innermost oval on a contour plot represent?",
      ],
      seniorTip: "Contour plots are used in debugging training. If the contour is very elongated (like a thin needle instead of a circle), it means features have different scales — gradient descent will zigzag inefficiently along the narrow dimension. The solution is feature scaling (normalisation or standardisation), which makes the contour more circular and lets gradient descent take more direct steps."
    },
    flashCards: [
      {
        q: "What does a contour plot of J(w, b) show?",
        a: "A top-down view of the 3D cost surface. Each oval/ellipse is a set of (w, b) combinations that all produce the same cost J — like altitude lines on a topographic map. The smallest inner oval = lowest cost = best model parameters (the minimum)."
      },
      {
        q: "In a contour plot, what does it mean to move from outer ovals to inner ovals?",
        a: "Moving inward = reducing the cost J = improving the model. This is what gradient descent does — it moves the (w, b) point from the outer high-cost ovals toward the centre minimum. Training visualised."
      },
      {
        q: "Why does a very elongated (needle-shaped) contour plot indicate a problem?",
        a: "Elongated contours mean features have very different scales. Gradient descent zigzags inefficiently along the narrow dimension. Solution: feature scaling (normalisation/standardisation) makes the contours more circular, allowing gradient descent to converge much faster."
      },
    ],
  },
  {
    slug: "14-parameters-model-cost",
    sectionId: "ml",
    title: "Parameters, Model & Cost — Together",
    order: 14,
    excerpt: "Connecting the model line, cost function, and contour plot into one unified picture.",
    theory: "<p>This lecture connected all the pieces into one visual. The key insight: <b>every (w, b) point on the contour plot corresponds to one specific line on the house price graph.</b></p><p>Examples from the lecture:</p><ul><li>w=-0.15, b=800 → a negatively-sloped line (prices decrease as size increases) — obviously wrong. On the contour plot: far from the minimum, on an outer oval with high cost.</li><li>w=0, b=360 → a flat horizontal line predicting $360K for every house regardless of size — bad but less bad. On the contour plot: closer to the minimum.</li><li>w≈0.14, b≈100 → a line with a reasonable slope and intercept — roughly fits the data. On the contour plot: near the centre minimum.</li></ul><p>This connection is the core insight of supervised learning: <b>every point in parameter space (w, b) maps to one model (line) and one cost value. Training is navigating this space to find the point with the lowest cost.</b></p>",
    example: "Andrew Ng walked through three specific (w, b) pairs. For each, he showed: (1) the corresponding line on the left plot, (2) its position on the contour plot on the right. The worse the line fits the data, the further from the minimum the point is on the contour. This is the visual proof that cost function is doing its job.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "In your own words, what does a single point on a contour plot represent?",
        "If the cost J is very high, what does that mean about the model's predictions?",
      ],
      seniorTip: "When debugging ML models in production, the contour plot intuition is invaluable. If training is oscillating, you're bouncing between high-cost regions. If training stalls, you're on a flat plateau. Understanding parameter space geometry helps you diagnose and fix problems without just blindly tuning hyperparameters."
    },
    flashCards: [
      {
        q: "What does a single point (w, b) on the contour plot represent?",
        a: "One specific combination of model parameters — and therefore one specific line f(x) = wx + b. The contour shows the cost J for that choice. Moving the point changes the line. The goal: find the point at the centre (minimum J) = best-fitting line."
      },
      {
        q: "Andrew Ng showed w=-0.15, b=800 as an example. What's wrong with it?",
        a: "w is negative, meaning the model predicts house prices decrease as size increases — the opposite of reality. The line has the wrong direction. On the contour plot this point is far from the minimum with high cost. b=800 means the model starts at $800K for a zero-size house — clearly wrong."
      },
      {
        q: "How does the model line on the left plot relate to the contour plot on the right?",
        a: "They're the same information in different views. Left: the line f(x) = wx + b over the data. Right: the point (w, b) with its cost J. Better-fitting lines = points closer to the minimum. This is the visual proof that the cost function captures model quality."
      },
    ],
  },
  {
    slug: "15-gradient-descent-concept",
    sectionId: "ml",
    title: "Gradient Descent — Concept",
    order: 15,
    excerpt: "The core optimisation algorithm that trains virtually every ML model.",
    theory: "<p><b>Gradient Descent</b> is the algorithm that trains virtually every ML model — from linear regression to GPT-4. Understanding it is non-negotiable for interviews.</p><p><b>The blind hiker analogy:</b> Imagine you're blindfolded on a hilly landscape. You can't see the whole terrain. You can only feel the slope under your feet. Your goal: reach the lowest valley. Your strategy: at every step, feel which direction is downhill and take one step that way. Repeat until you can't go any lower.</p><p>In ML: the 'landscape' is the cost function J(w,b). The 'valley floor' is the minimum cost (best model). The 'slope' is the gradient (mathematical derivative). Gradient descent is the algorithm that takes those downhill steps.</p><p><b>The update rule (memorise this):</b></p><ul><li>w := w − α × (∂J/∂w)</li><li>b := b − α × (∂J/∂b)</li></ul><p>Where α (alpha) = learning rate (step size). Both updates happen simultaneously using the same current values.</p><p><b>Critical rule:</b> Update ALL parameters simultaneously. Compute all derivatives first using current values, then update them all at once. Updating w first and using the new w to compute b's derivative is a bug — you'd be computing the wrong gradient.</p><p><b>Three variants you must know:</b></p><ul><li><b>Batch GD</b>: use all training data for each step — very stable but slow for large datasets</li><li><b>Stochastic GD (SGD)</b>: use one random sample per step — fast but very noisy (zigzags)</li><li><b>Mini-batch GD</b>: use batches of 32–512 samples — industry standard, balances speed + stability + GPU parallelism</li></ul>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Explain gradient descent in plain English.",
        "What are the three types of gradient descent? When would you use each?",
        "What is the difference between a local and global minimum?",
      ],
      seniorTip: "The three variants: Batch GD (full dataset each step — stable but slow for large datasets), Stochastic GD (one random sample — fast but noisy), Mini-batch GD (small batches of 32–512 — the industry standard that balances speed, stability, and GPU parallelism). Always mention mini-batch GD for production."
    },
    flashCards: [
      {
        q: "In one sentence, what does gradient descent do?",
        a: "It repeatedly adjusts the model's parameters in the direction that most reduces the cost function, until the cost reaches its minimum (or stops improving)."
      },
      {
        q: "What does the 'gradient' represent, and which direction do we move?",
        a: "The gradient is the slope of the cost function — it points in the direction of steepest ascent (uphill). Gradient descent moves in the opposite direction (downhill, negative gradient) to reduce the cost."
      },
      {
        q: "What is the parameter update rule for gradient descent?",
        a: "w := w − α × (∂J/∂w)   b := b − α × (∂J/∂b)   Where α (alpha) is the learning rate. You subtract the learning rate times the partial derivative. Both updates happen simultaneously using the same current values."
      },
      {
        q: "What happens if the learning rate α is too large? Too small?",
        a: "Too large → the algorithm overshoots the minimum and may diverge (cost increases each step). Too small → the algorithm is correct but painfully slow to converge. Finding a good α is one of the key hyperparameter tuning tasks."
      },
      {
        q: "What are the three variants of gradient descent and which is used in practice?",
        a: "Batch GD (all data each step — stable but slow), Stochastic GD (one sample — fast but very noisy), Mini-batch GD (batches of 32–512 — industry standard). Mini-batch is used in virtually all production ML and deep learning."
      },
      {
        q: "Why must you update all parameters simultaneously in gradient descent?",
        a: "You compute all derivatives using the current (w, b) values first, then update them all at once. If you update w first and use the new w to compute b's derivative, you're computing the wrong gradient — this is a common implementation mistake."
      },
    ],
  },
  {
    slug: "16-gradient-descent-update-rule",
    sectionId: "ml",
    title: "Gradient Descent — Update Rule",
    order: 16,
    excerpt: "The actual update equations — the math behind every gradient step.",
    theory: "<p>This lecture gave the actual mathematical update rule. Andrew Ng's exact formulation:</p><p><b>On each step:</b></p><ul><li><code>w := w − α × (∂J(w,b)/∂w)</code></li><li><code>b := b − α × (∂J(w,b)/∂b)</code></li></ul><p>The <code>:=</code> symbol is the <b>assignment operator</b> (not a mathematical equality). It means 'compute the right side, then store it in the variable on the left'. Andrew Ng was careful to distinguish this from mathematical equality.</p><p><b>Breaking down the formula:</b></p><ul><li><b>α (alpha)</b>: the learning rate — controls how big each step is</li><li><b>∂J/∂w</b>: the partial derivative of the cost w.r.t. w — tells you the slope in the w direction</li><li><b>Subtract</b>: because we want to go downhill (reduce J), we move against the gradient</li></ul><p><b>Critical rule — simultaneous update:</b> You MUST compute both ∂J/∂w and ∂J/∂b using the CURRENT values of (w, b) first, then update both. Updating w first and using the new w to compute ∂J/∂b is a bug — you're computing the derivative at a different point.</p><p><b>Correct implementation:</b></p><ul><li>temp_w = w − α × ∂J/∂w  (computed with current w, b)</li><li>temp_b = b − α × ∂J/∂b  (computed with current w, b)</li><li>w = temp_w</li><li>b = temp_b</li></ul>",
    example: "Pseudocode implementing simultaneous update correctly:\n  dJ_dw = (1/m) × sum(f_wb(x[i]) - y[i]) × x[i] for all i\n  dJ_db = (1/m) × sum(f_wb(x[i]) - y[i]) for all i\n  w = w - alpha × dJ_dw   # Use dJ_dw computed BEFORE updating w\n  b = b - alpha × dJ_db   # Use dJ_db computed with ORIGINAL (w, b)",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why must w and b be updated simultaneously in gradient descent?",
        "What is the difference between := (assignment) and = (equality) in ML pseudocode?",
        "What is the partial derivative ∂J/∂w telling you?",
      ],
      seniorTip: "The simultaneous update rule is where beginners make implementation bugs. In NumPy/PyTorch, parameter updates are naturally simultaneous because you compute all gradients (via backward()) before any optimizer.step() call. The framework enforces correctness. But in a from-scratch implementation, you must store temp variables. This comes up in coding interviews."
    },
    flashCards: [
      {
        q: "Write the gradient descent update rule for w and b.",
        a: "w := w − α × (∂J/∂w)   b := b − α × (∂J/∂b)   Where := is assignment (not equality), α is the learning rate, and ∂J/∂w is the partial derivative of cost w.r.t. w. Both updates use the CURRENT (w, b) values — computed simultaneously."
      },
      {
        q: "Why is simultaneous update critical — what breaks if you don't do it?",
        a: "If you update w first (w_new), then compute ∂J/∂b using w_new, you're computing the gradient at the wrong point. You'd be evaluating the derivative at a point you haven't committed to yet. This gives incorrect gradient estimates and the algorithm may not converge."
      },
      {
        q: "What does the ∂J/∂w term represent — intuition without calculus?",
        a: "It tells you: 'If I increase w by a tiny amount, does the cost J go up or down, and by how much?' If ∂J/∂w > 0, increasing w makes cost worse → decrease w. If ∂J/∂w < 0, increasing w makes cost better → increase w. The magnitude tells you the steepness."
      },
    ],
  },
  {
    slug: "17-derivative-intuition",
    sectionId: "ml",
    title: "Derivative Intuition for Gradient Descent",
    order: 17,
    excerpt: "The tangent line trick — why the sign and magnitude of the gradient guide every step.",
    theory: "<p>This lecture built intuition for derivatives without heavy calculus. Key idea: the derivative at a point is the <b>slope of the tangent line</b> at that point.</p><p>Andrew Ng's example: take the J(w) curve (with b=0 for simplicity). Pick a point to the right of the minimum:</p><ul><li>Draw the tangent line at that point — it slopes upward (positive slope)</li><li>∂J/∂w = positive value</li><li>Update: w := w − α × (positive value) → <b>w decreases</b></li><li>On the graph: w moves left, toward the minimum</li></ul><p>Pick a point to the left of the minimum:</p><ul><li>Tangent line slopes downward (negative slope)</li><li>∂J/∂w = negative value</li><li>Update: w := w − α × (negative value) = w + positive → <b>w increases</b></li><li>On the graph: w moves right, toward the minimum</li></ul><p>Both cases converge toward the minimum automatically. <b>This is the elegance of gradient descent — the sign of the derivative always pushes you in the right direction.</b></p><p><b>Magnitude matters too:</b> Far from the minimum, the slope is steep (large derivative → large step). Near the minimum, the slope is flat (small derivative → small step). Gradient descent naturally takes bigger steps when far away and smaller steps as it approaches — even with a fixed learning rate.</p>",
    example: "You're at w=3 on the J(w) curve. The tangent at w=3 has slope +2 (positive). Update: w = 3 − 0.1 × 2 = 2.8. Move left. Next step at w=2.8 has slope +1.5 (less steep). Update: w = 2.8 − 0.1 × 1.5 = 2.65. Steps get smaller as you approach the minimum. No code changes needed — the math handles it automatically.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "If the derivative ∂J/∂w is positive at the current w, does gradient descent increase or decrease w?",
        "Why do gradient descent steps naturally get smaller as you approach the minimum?",
        "What is the derivative equal to at the minimum?",
      ],
      seniorTip: "The automatic step-size reduction is a key insight. Since the gradient gets smaller as you approach the minimum (flatter slope), gradient descent naturally slows down — even with fixed α. This is why fixed learning rate can work well for convex functions. For non-convex problems (neural nets), adaptive optimisers (Adam) additionally track gradient history to adjust α per parameter."
    },
    flashCards: [
      {
        q: "If ∂J/∂w is positive at the current w, what does gradient descent do to w?",
        a: "Decreases w. Update: w := w − α × (positive number) → w gets smaller. This moves w left along the J(w) curve, toward the minimum. Positive derivative = you're on the right side of the minimum = move left."
      },
      {
        q: "If ∂J/∂w is negative at the current w, what does gradient descent do to w?",
        a: "Increases w. Update: w := w − α × (negative number) = w + positive → w gets larger. This moves w right along the J(w) curve, toward the minimum. Negative derivative = you're on the left side = move right."
      },
      {
        q: "Why do gradient descent steps automatically get smaller near the minimum?",
        a: "Because the slope (derivative) gets smaller as you approach the minimum — the curve becomes flat. Gradient descent step = α × derivative. When derivative is small, the step is small. No code change needed — this is built into the math. Far from minimum: large steps. Near minimum: tiny steps."
      },
      {
        q: "What is the derivative equal to at the minimum, and what does that mean for updates?",
        a: "Zero. At the minimum, the tangent line is flat (horizontal). ∂J/∂w = 0. Update: w := w − α × 0 = w (no change). Gradient descent stops naturally at the minimum — no separate stopping condition needed for a convex function."
      },
    ],
  },
  {
    slug: "18-learning-rate",
    sectionId: "ml",
    title: "Learning Rate",
    order: 18,
    excerpt: "The most critical hyperparameter — too large diverges, too small barely moves.",
    theory: "<p>The <b>learning rate (α)</b> controls how large each gradient descent step is.</p><ul><li><b>Too large</b>: steps overshoot the minimum, cost oscillates and may diverge (keep going up)</li><li><b>Too small</b>: algorithm converges correctly but takes an extremely long time</li><li><b>Just right</b>: cost decreases smoothly and converges efficiently</li></ul><p>Practical search strategy: try values on a log scale — 0.0001, 0.001, 0.01, 0.1 — and plot the cost curve for each. Pick the largest value that still converges smoothly.</p>",
    example: "Analogy: α is the size of your step going down a hill. Too large: you overshoot to the other side and end up higher. Too small: you'll get there eventually but it might take 10,000 steps instead of 100.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What happens if the learning rate is too high? Too low?",
        "How do you choose a good learning rate in practice?",
        "What is a learning rate scheduler?",
      ],
      seniorTip: "In production we don't use fixed learning rates. We use schedulers (warm-up + cosine decay) or adaptive optimisers (Adam, AdaGrad, RMSProp) that auto-tune the learning rate per parameter. Adam is the default choice for deep learning because it adapts to each parameter's gradient history."
    },
    flashCards: [
      {
        q: "What happens when the learning rate α is too large?",
        a: "The algorithm overshoots the minimum. Each step lands on the other side of the valley, further up the slope. Cost oscillates and may diverge (keep increasing). Andrew Ng: 'If α is too large, gradient descent may overshoot and fail to converge, or even diverge.'"
      },
      {
        q: "What happens when the learning rate α is too small?",
        a: "The algorithm converges correctly but takes a very long time. Andrew Ng's analogy: 'You end up taking tiny baby steps.' Each step reduces cost by an infinitesimal amount. You'll get there eventually, but may need 10,000 iterations instead of 100."
      },
      {
        q: "How do you choose a good learning rate in practice?",
        a: "Search on a log scale: try 0.001, 0.01, 0.1, 1.0. For each value, plot cost vs. iterations for 100 steps. Pick the largest α that still shows monotonically decreasing cost. In deep learning, Adam optimizer is the default because it adapts the learning rate per parameter automatically."
      },
      {
        q: "Can gradient descent get stuck even with a good learning rate for linear regression?",
        a: "No. Linear regression with MSE has a convex (bowl-shaped) cost function — only one minimum exists. With a good learning rate, gradient descent always finds it. For neural networks (non-convex), local minima and saddle points are real challenges."
      },
    ],
  },
  {
    slug: "19-final-linear-regression",
    sectionId: "ml",
    title: "Completing Linear Regression",
    order: 19,
    excerpt: "The complete training loop: model + cost + gradient derivation all in one.",
    theory: "<p>This lecture pulled everything together. Andrew Ng derived the actual gradient formulas for linear regression — the exact derivatives you compute in gradient descent.</p><p><b>The complete gradient formulas:</b></p><ul><li>∂J/∂w = (1/m) × Σᵢ (f_wb(xᵢ) − yᵢ) × xᵢ</li><li>∂J/∂b = (1/m) × Σᵢ (f_wb(xᵢ) − yᵢ)</li></ul><p>Structure: the error for each example (prediction minus true value) × the feature (for ∂J/∂w) or just the error (for ∂J/∂b). Then average over all m examples.</p><p><b>The term 'Batch Gradient Descent'</b>: This specific version is called batch GD because each step uses the <b>entire training set</b> (all m examples) to compute the gradient. Andrew Ng: 'This gradient descent process is called batch gradient descent.' In deep learning, mini-batch GD is used instead for efficiency.</p><p><b>Guarantee for linear regression:</b> The squared error cost function for linear regression is always convex — so batch gradient descent always converges to the global minimum (with appropriate α). No local minima to worry about.</p>",
    example: "Full training loop: 1) Start with w=0, b=0. 2) Predict ŷᵢ = 0×xᵢ + 0 = 0 for all houses. 3) Compute cost: J = (1/2m)Σ(0 - yᵢ)² = very high. 4) Compute gradients. 5) Update w and b. 6) New predictions are slightly better. Repeat 1000 times. By iteration 1000, w≈0.14, b≈100, and the line fits the Portland housing data well.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Write out the gradient formulas for linear regression.",
        "What is 'batch' gradient descent and how does it differ from mini-batch?",
        "Why is linear regression's cost function guaranteed to converge?",
      ],
      seniorTip: "The key difference between batch and mini-batch: batch uses all m examples per gradient step (expensive per step, stable). Mini-batch uses B examples (e.g. B=32). In production, mini-batch is always used because: (1) faster per step, (2) GPU parallelism, (3) the noise can help escape local minima in neural networks."
    },
    flashCards: [
      {
        q: "Write the gradient formula for ∂J/∂w in linear regression.",
        a: "∂J/∂w = (1/m) × Σᵢ₌₁ᵐ (f_wb(xᵢ) − yᵢ) × xᵢ   i.e., (1/m) × sum of (error × feature) for all m training examples. The error is prediction minus true value."
      },
      {
        q: "How does the gradient formula for ∂J/∂b differ from ∂J/∂w?",
        a: "∂J/∂b = (1/m) × Σᵢ (f_wb(xᵢ) − yᵢ)   Same structure but WITHOUT the xᵢ term at the end. It's just the average error. This makes sense: b is the intercept (constant), so its gradient doesn't depend on the feature value."
      },
      {
        q: "What is 'batch' gradient descent?",
        a: "Andrew Ng's term: gradient descent where each parameter update uses ALL m training examples to compute the gradients. 'Batch' = full dataset. In deep learning, mini-batch GD (using batches of 32-512) is preferred because it's faster and GPUs can parallelise within a batch."
      },
      {
        q: "Why is linear regression with MSE guaranteed to find the global minimum?",
        a: "Because the MSE cost function for linear regression is convex — it has exactly one global minimum and no local minima. Gradient descent on a convex function always reaches the global minimum given a sufficiently small learning rate. Neural networks are non-convex, so this guarantee doesn't apply."
      },
    ],
  },
  {
    slug: "20-gradient-descent-demo",
    sectionId: "ml",
    title: "Gradient Descent — Live Demo",
    order: 20,
    excerpt: "Watching the algorithm actually run — the parameter trajectory toward the minimum.",
    theory: "<p>This lecture showed gradient descent running live. Starting from w=-0.1, b=900 — a deliberately bad starting point (predicts price = -0.1×size + 900, a slightly negative slope with a high intercept).</p><p>Andrew Ng walked through each step:</p><ol><li>Step 1: (w, b) moves slightly toward the minimum on the contour plot. The line on the house data changes slightly.</li><li>Each step: cost decreases. The parameter path traces a trajectory on the contour plot.</li><li>Convergence: the path reaches the centre of the contour plot (minimum). The line now fits the data well.</li></ol><p><b>The final result:</b> the best-fit line. For a friend's 1,250 sq ft house, the model predicts approximately $250K. Andrew Ng: 'Isn't that cool. And so that's gradient descent and we're going to use this to fit a model to the holding data.'</p><p><b>Key observation:</b> Early steps are large (far from minimum, steep slope → large gradient → big step). Later steps are small (near minimum, flat slope → small gradient → tiny step). Fixed α, but step sizes vary naturally with the gradient magnitude.</p>",
    example: "Starting: w=-0.1, b=900, f(x) = -0.1x + 900. After convergence: w≈0.14, b≈100, f(x) = 0.14x + 100. For x=1250 (sq ft): prediction = 0.14×1250 + 100 = 275K. On the contour plot, the parameter path spirals from the outer ovals toward the centre minimum — like water draining into a sink.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why do gradient descent steps naturally decrease in size as training progresses?",
        "What visual patterns tell you gradient descent is working vs. broken?",
        "What is the difference between batch GD and mini-batch GD?",
      ],
      seniorTip: "In a system design interview, when asked 'how does your model train', the right answer traces this pipeline: define model f → define cost J → compute gradients → simultaneous parameter update → repeat. That shows you understand training as optimisation, not just as 'call model.fit()'."
    },
    flashCards: [
      {
        q: "In the live demo, Andrew Ng started gradient descent at w=-0.1, b=900. What does this line look like?",
        a: "f(x) = -0.1x + 900. A nearly horizontal line with a slight negative slope. It predicts ~$900K for a 0-size house and prices slightly decrease as size increases. Completely wrong. But gradient descent finds the correct model from this terrible starting point."
      },
      {
        q: "Why do gradient descent steps get smaller over time even with a fixed learning rate?",
        a: "Because the gradient (slope of J) gets smaller as you approach the minimum. The cost curve flattens near the bottom. Step size = α × gradient. Fixed α, smaller gradient = smaller step. This is automatic — no code changes needed."
      },
      {
        q: "How do you visually verify gradient descent is working correctly?",
        a: "1. Cost curve: should decrease monotonically each iteration, then plateau. 2. Contour plot: (w,b) path should spiral inward toward the centre minimum. 3. If cost increases: α too large or gradient computation bug. 4. If cost barely moves: α too small or features need scaling."
      },
      {
        q: "What does Andrew Ng mean by 'batch gradient descent'?",
        a: "Each gradient update uses ALL m training examples. The cost J = (1/2m)Σ errors² averages over the entire dataset per step. 'Batch' = full dataset. Contrast with mini-batch GD (standard in deep learning) which uses B examples per step (B=32 to 512). Mini-batch is faster and fits GPU memory."
      },
    ],
  },
  // Week 2 — Multiple Features
  {
    slug: "21-multiple-linear-regression",
    sectionId: "ml",
    title: "Multiple Linear Regression",
    order: 21,
    excerpt: "Extending to many features simultaneously — the vectorised dot product form.",
    theory: "<p>Real problems have multiple input features. Multiple linear regression handles this:</p><p><code>ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b = w⃗ · x⃗ + b</code></p><p>The dot product w⃗ · x⃗ computes the sum of each feature multiplied by its weight — this is the vectorised form. Each weight wᵢ represents how much feature xᵢ independently contributes to the prediction, holding all other features constant.</p><p>With n features, we have n weights + 1 bias = n+1 parameters to learn.</p>",
    example: "House price: ŷ = 200·(sqft) + 50000·(bedrooms) + 30000·(bathrooms) − 1000·(age in years) + 80000. Each coefficient independently captures that feature's contribution.",
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "22-vectorisation",
    sectionId: "ml",
    title: "Vectorisation",
    order: 22,
    excerpt: "Why vectorised code is 100× faster — numpy and hardware parallelism.",
    theory: "<p><b>Vectorisation</b> replaces explicit Python for-loops with matrix/vector operations that execute in parallel on CPU/GPU hardware.</p><p>A naive Python loop processes one element at a time sequentially. NumPy's vectorised operations leverage SIMD (Single Instruction, Multiple Data) hardware — applying one instruction to many values simultaneously.</p><p>Result: the same computation in NumPy is typically 100–300× faster than a Python loop. In deep learning, this is not a minor optimisation — it's the difference between training in hours vs. years.</p>",
    example: "np.dot(w, x) vs a Python loop summing w[i]*x[i] for all i: identical output, but np.dot exploits CPU vectorisation hardware and is orders of magnitude faster.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why is vectorisation faster than a for-loop in Python?",
        "What does SIMD stand for and how does it apply to ML?",
      ],
      seniorTip: "SIMD = Single Instruction, Multiple Data. The CPU applies one instruction to a vector of values simultaneously. GPUs take this 1,000× further with thousands of cores all running in parallel. This is fundamentally why deep learning became practical — matrix multiply on a GPU is why we can train BERT in hours."
    },
  },
  {
    slug: "23-vectorisation-behind-scenes",
    sectionId: "ml",
    title: "Vectorisation — Under the Hood",
    order: 23,
    excerpt: "How NumPy, BLAS, and GPU kernels actually execute computations in parallel.",
    theory: "<p>NumPy calls highly optimised BLAS/LAPACK libraries (OpenBLAS, Intel MKL) written in Fortran/C and hand-tuned for CPU cache architecture. These libraries achieve near-theoretical peak CPU performance.</p><p>On GPUs, operations like matrix multiply are CUDA kernels — the GPU's thousands of cores each compute a small portion of the result in parallel. A single matrix multiplication that takes seconds on CPU takes milliseconds on GPU.</p><p>This is why the core operation of deep learning — W·X + b — can train billion-parameter models in hours rather than years.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "24-feature-scaling",
    sectionId: "ml",
    title: "Feature Scaling",
    order: 24,
    excerpt: "Normalising features so gradient descent converges faster — a must-do step.",
    theory: "<p>If features have very different scales (e.g., house size in sq ft = 1,500 vs bedrooms = 3), the cost function becomes a very elongated ellipse. Gradient descent zigzags inefficiently along the narrow direction.</p><p>Feature scaling makes all features comparable in magnitude, making the cost function more circular and allowing gradient descent to take more direct steps toward the minimum.</p><p>Two standard methods:</p><ul><li><b>Min-Max Normalisation</b>: x_scaled = (x − x_min) / (x_max − x_min) → range [0, 1]</li><li><b>Z-score Standardisation</b>: x_scaled = (x − μ) / σ → mean=0, std=1</li></ul>",
    example: "After z-score scaling, 'house size (sq ft)' and 'number of bedrooms' both have mean ≈ 0 and std ≈ 1. Gradient descent now takes balanced steps in both dimensions instead of zigzagging.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why does feature scaling improve gradient descent?",
        "What is the difference between normalisation and standardisation?",
        "What is the most common data leakage mistake with feature scaling?",
      ],
      seniorTip: "Always fit the scaler on training data only, then apply the same μ and σ to validation and test sets. Using the test set's statistics to scale training data is data leakage — a critical production mistake. sklearn's StandardScaler stores fitting parameters for exactly this reason."
    },
  },
  {
    slug: "25-implement-feature-scaling",
    sectionId: "ml",
    title: "Implementing Feature Scaling",
    order: 25,
    excerpt: "Coding z-score normalisation from scratch; using sklearn's StandardScaler.",
    theory: "<p>Manual implementation:</p><ol><li>Compute μ = mean of each feature column across training examples</li><li>Compute σ = standard deviation of each feature column</li><li>Transform: x_scaled = (x − μ) / σ for each feature</li><li>Store μ and σ — apply the same values to val/test/production data</li></ol><p>sklearn's StandardScaler encapsulates this: <code>scaler.fit(X_train)</code> stores μ/σ, then <code>scaler.transform(X)</code> applies it. The separation of fit and transform is the key design pattern.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "26-gradient-descent-convergence",
    sectionId: "ml",
    title: "Gradient Descent Convergence",
    order: 26,
    excerpt: "The learning curve — how to tell when training is done and when it's broken.",
    theory: "<p>Plot cost J on the y-axis against iteration number on the x-axis. This is the <b>learning curve</b>.</p><p>If gradient descent is working correctly: cost decreases monotonically every iteration and eventually flattens asymptotically.</p><ul><li>Cost goes <b>up</b> → learning rate α is too large or there's a bug in the gradient computation</li><li>Cost decreases but <b>very slowly</b> → α too small, or feature scaling needed</li><li>Cost decreases then <b>plateaus</b> → converged (or stuck in local minimum for non-convex problems)</li></ul><p>A common stopping criterion: stop when ΔJ < 10⁻³ between consecutive iterations.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "27-choosing-learning-rate",
    sectionId: "ml",
    title: "Choosing the Learning Rate",
    order: 27,
    excerpt: "The log-scale sweep strategy for finding a good α systematically.",
    theory: "<p>No single α works universally. A systematic approach:</p><ol><li>Start with a very small α (e.g., 0.0001) to verify the cost decreases</li><li>Multiply by 3× for each trial: 0.0001 → 0.0003 → 0.001 → 0.003 → 0.01 → 0.03 → 0.1</li><li>Plot cost vs. iterations for each trial</li><li>Choose the largest α that still converges smoothly</li></ol><p>This log-scale sweep takes ~7 experiments and reliably finds a strong starting point. It's the same strategy used when tuning deep learning models.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "28-feature-engineering",
    sectionId: "ml",
    title: "Feature Engineering",
    order: 28,
    excerpt: "Creating better input features using domain knowledge — often the biggest performance lever.",
    theory: "<p><b>Feature engineering</b> uses domain knowledge to create new input features that expose the underlying pattern more directly to the model.</p><p>The fundamental insight: raw data rarely has features in the ideal form for learning. A skilled ML engineer transforms raw inputs into features that make the pattern obvious.</p><p>Common techniques: combining features (multiplication, ratio), binning continuous features into categories, extracting components (year from date), creating indicator variables (is_weekend).</p>",
    example: "House pricing: instead of 'frontage' and 'depth' separately, create 'area = frontage × depth'. Traffic: instead of hour and day_of_week, create binary 'is_rush_hour' = (weekday AND hour in 7–9am or 4–7pm). A single well-engineered feature often outperforms many raw ones.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is feature engineering? Give a concrete example.",
        "When is feature engineering most important — classical ML or deep learning?",
      ],
      seniorTip: "In classical ML (XGBoost, linear models), feature engineering is the primary performance driver — the model can't discover interactions itself. In deep learning, the model learns features automatically from raw data (images, text). A senior answer shows you know where human expertise adds the most value."
    },
  },
  {
    slug: "29-polynomial-regression",
    sectionId: "ml",
    title: "Polynomial Regression",
    order: 29,
    excerpt: "Fitting curves not just lines — by engineering x², x³ as new features.",
    theory: "<p><b>Polynomial regression</b> fits non-linear relationships by creating polynomial feature terms:</p><p><code>ŷ = w₁x + w₂x² + w₃x³ + b</code></p><p>This is still <i>linear regression</i> under the hood — the model is linear in its parameters (w₁, w₂, w₃). We just engineer x², x³ as new features and feed them to the standard linear regression algorithm.</p><p>The choice of polynomial degree is a hyperparameter — too high leads to overfitting. Feature scaling is critical here because x³ can reach enormous values.</p>",
    example: "House price vs size: degree=1 (underfit — straight line misses the curve). Degree=15 (overfit — wiggles through every training point but fails on new data). Degree=3 (just right — captures the curve without memorising noise).",
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  // Week 3 — Classification
  {
    slug: "30-classification-week3",
    sectionId: "ml",
    title: "Classification — Deep Dive",
    order: 30,
    excerpt: "Why linear regression fails for classification and what to use instead.",
    theory: "<p>If you naively apply linear regression to a classification problem (e.g., tumour malignancy), predicted values can go below 0 or above 1 — meaningless as probabilities.</p><p>Worse, the decision threshold shifts as you add more extreme data points. A single outlier with a very large feature value can pull the regression line, flipping the classification of all other examples.</p><p>This formally motivates logistic regression, which is specifically designed to output calibrated probabilities in [0, 1] regardless of input values.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "31-logistic-regression",
    sectionId: "ml",
    title: "Logistic Regression",
    order: 31,
    excerpt: "The sigmoid function — squashing any real number into a probability [0, 1].",
    theory: "<p><b>Logistic Regression</b> applies the sigmoid function to the output of a linear equation:</p><p><code>ŷ = σ(z) = 1 / (1 + e^−z)  where z = w⃗ · x⃗ + b</code></p><p>The sigmoid (σ) maps any real number to the range (0, 1):</p><ul><li>z → +∞ : σ → 1 (very confident class 1)</li><li>z = 0 : σ = 0.5 (maximum uncertainty)</li><li>z → −∞ : σ → 0 (very confident class 0)</li></ul><p>The output is interpreted as P(y=1 | x) — the probability the input belongs to the positive class. We typically classify as 1 if ŷ > 0.5.</p>",
    example: "Spam filter: σ(wx+b) = 0.87 means '87% probability this is spam'. Decision rule: if ŷ > 0.5, classify as spam. The threshold 0.5 can be adjusted based on the cost of false positives vs false negatives.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why do we use logistic regression instead of linear regression for classification?",
        "What does the output of a logistic regression model represent?",
        "How do you change the classification threshold and when would you do this?",
      ],
      seniorTip: "The threshold 0.5 is the default but rarely optimal. In medical diagnosis, you'd lower the threshold (e.g., 0.2) to reduce false negatives even at the cost of more false positives — missing cancer is worse than unnecessary further testing. Always discuss threshold tuning in the context of business cost asymmetry."
    },
  },
  {
    slug: "32-decision-boundary",
    sectionId: "ml",
    title: "Decision Boundary",
    order: 32,
    excerpt: "Where the model draws the line between classes — linear and non-linear boundaries.",
    theory: "<p>The <b>decision boundary</b> is the surface in feature space where the model's predicted probability = 0.5, i.e., where z = w⃗·x⃗ + b = 0.</p><p>Everything on one side: predicted class 1. Other side: class 0.</p><ul><li>With linear features: a straight line (2D), plane (3D), or hyperplane</li><li>With polynomial features: a curved boundary (circle, parabola, complex shapes)</li></ul><p>The model's learned parameters (w, b) fully define where this boundary sits. More expressive models (higher polynomial degree) can fit more complex boundaries — but risk overfitting.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "33-logistic-cost-function",
    sectionId: "ml",
    title: "Logistic Regression — Cost Function",
    order: 33,
    excerpt: "Why MSE creates non-convex surfaces for classification; introducing log loss.",
    theory: "<p>Using MSE as the cost function for logistic regression creates a <b>non-convex</b> cost surface with many local minima that gradient descent can't reliably escape.</p><p>Instead, we use <b>Log Loss</b> (Binary Cross-Entropy), which is derived from maximum likelihood estimation and produces a convex surface:</p><ul><li>If y=1: loss = −log(ŷ) — large penalty when ŷ ≈ 0 (you were confident and wrong)</li><li>If y=0: loss = −log(1−ŷ) — large penalty when ŷ ≈ 1 (confident and wrong again)</li></ul><p>Average cost: J = (1/m) Σ [−y·log(ŷ) − (1−y)·log(1−ŷ)]</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why can't we use MSE as the cost function for logistic regression?",
        "What is log loss intuitively? What does it penalise most?",
        "Where does log loss come from mathematically?",
      ],
      seniorTip: "Log loss (cross-entropy) is derived from maximum likelihood estimation — we're maximising the probability that the training labels were generated by our model. This gives it a solid probabilistic grounding. Knowing the MLE derivation separates senior answers from junior ones."
    },
  },
  {
    slug: "34-simplified-logistic-loss",
    sectionId: "ml",
    title: "Simplified Logistic Loss",
    order: 34,
    excerpt: "Combining the y=0 and y=1 cases into one elegant unified formula.",
    theory: "<p>The two-case log loss can be unified into one expression:</p><p><code>loss(ŷ, y) = −y·log(ŷ) − (1−y)·log(1−ŷ)</code></p><p>When y=1: second term vanishes → loss = −log(ŷ)<br/>When y=0: first term vanishes → loss = −log(1−ŷ)</p><p>This single formula handles both cases cleanly. It's exactly what you'll find in every deep learning framework's <code>BCELoss</code> (binary cross-entropy loss) implementation.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "35-gradient-descent-logistic",
    sectionId: "ml",
    title: "Gradient Descent for Logistic Regression",
    order: 35,
    excerpt: "Same update rule as linear regression — but with sigmoid applied underneath.",
    theory: "<p>The gradient descent update equations for logistic regression look identical to linear regression:</p><p><code>w := w − α · (1/m) Σ (ŷᵢ − yᵢ) · xᵢ</code><br/><code>b := b − α · (1/m) Σ (ŷᵢ − yᵢ)</code></p><p>The critical difference is hidden inside ŷᵢ: for logistic regression, ŷᵢ = σ(w⃗·x⃗ᵢ + b) — the sigmoid is applied before computing the error. Same gradient descent algorithm shape, different model function.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "36-overfitting-underfitting",
    sectionId: "ml",
    title: "Overfitting & Underfitting",
    order: 36,
    excerpt: "The bias-variance tradeoff — the single most important concept in applied ML.",
    theory: "<p>Two failure modes:</p><p><b>Underfitting (High Bias)</b>: model is too simple to capture the true pattern. Performs poorly on both training and test data. Symptoms: training loss is high.</p><p><b>Overfitting (High Variance)</b>: model memorises the training data including noise. Performs perfectly on training, poorly on unseen test data. Symptoms: training loss low, test loss high.</p><p>Solutions to overfitting:</p><ul><li>Collect more training data (usually most effective)</li><li>Reduce model complexity (fewer features or lower polynomial degree)</li><li>Regularisation (add penalty for large weights)</li></ul>",
    example: "Fitting a polynomial to 10 data points: degree=1 underfit (misses the S-curve). Degree=9 overfit (passes through every point but oscillates wildly between them). Degree=3 is just right.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is overfitting? How do you detect and fix it?",
        "Explain the bias-variance tradeoff.",
        "How does collecting more data help with overfitting but not underfitting?",
      ],
      seniorTip: "The most critical ML concept. A senior answer connects it to the evaluation pipeline: 'We use the validation set to tune hyperparameters and detect overfitting. We never touch the test set during development — any tuning based on test performance is data leakage that gives falsely optimistic estimates of generalisation.' Also mention cross-validation for small datasets."
    },
  },
  {
    slug: "37-regularisation-concept",
    sectionId: "ml",
    title: "Regularisation — Concept",
    order: 37,
    excerpt: "Adding a penalty for large weights — the elegant way to prevent overfitting.",
    theory: "<p><b>Regularisation</b> adds a penalty term to the cost function that discourages large parameter values.</p><p>Intuition: large weights mean the model is making sharp, confident decisions that may be specific to training noise. Penalising large weights forces the model toward simpler, smoother solutions that generalise better to unseen data.</p><p>Regularisation strength is controlled by λ (lambda):</p><ul><li>λ = 0: no regularisation (pure fit to training data)</li><li>λ → ∞: all weights forced to zero (model predicts the constant mean — severe underfitting)</li><li>λ just right: model generalises well</li></ul>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is regularisation? Why does it reduce overfitting?",
        "What is the difference between L1 (Lasso) and L2 (Ridge) regularisation?",
        "What does the regularisation parameter λ control?",
      ],
      seniorTip: "L2 (Ridge) penalises w² → shrinks all weights smoothly toward zero. L1 (Lasso) penalises |w| → drives some weights exactly to zero, performing automatic feature selection. Use L1 when you believe many features are irrelevant. Elastic Net combines both. In deep learning, dropout is the dominant regularisation technique."
    },
  },
  {
    slug: "38-regularisation-math-linear",
    sectionId: "ml",
    title: "Regularisation — Math for Linear Regression",
    order: 38,
    excerpt: "L2 penalty added to MSE; weight decay in the gradient update.",
    theory: "<p>Regularised cost function (L2 / Ridge):</p><p><code>J(w,b) = (1/2m) Σ (ŷᵢ − yᵢ)² + (λ/2m) Σwⱼ²</code></p><p>Note: the bias term b is typically NOT regularised.</p><p>Updated gradient for w:</p><p><code>w := w · (1 − α·λ/m) − α · (1/m) Σ(ŷᵢ−yᵢ)·xᵢ</code></p><p>The factor (1 − α·λ/m) is slightly less than 1 — every update shrinks w by a small fraction before applying the gradient. This is called <b>weight decay</b>, the name used in deep learning optimisers.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "39-regularised-logistic-regression",
    sectionId: "ml",
    title: "Regularised Logistic Regression",
    order: 39,
    excerpt: "Applying L2 regularisation to logistic regression — the production standard.",
    theory: "<p>The same L2 penalty applies to logistic regression:</p><p><code>J = (1/m) Σ [cross-entropy loss] + (λ/2m) Σwⱼ²</code></p><p>The w update picks up the same weight decay factor (1 − α·λ/m).</p><p>In practice: sklearn's <code>LogisticRegression</code> defaults to L2 regularisation. The parameter is <b>C = 1/λ</b> — smaller C = stronger regularisation (inverse convention!). PyTorch's Adam optimiser has a <code>weight_decay</code> parameter that is exactly this L2 penalty.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "How does regularised logistic regression differ from unregularised?",
        "In sklearn's LogisticRegression, what does the C parameter control?",
        "Why is it called 'weight decay' in deep learning?",
      ],
      seniorTip: "In sklearn, C = 1/λ — so smaller C means stronger regularisation. This is the inverse of the usual convention. Knowing library-specific conventions is a production readiness signal. Weight decay = same math, different name — the weight shrinks a bit each step before the gradient update."
    },
  },
];

// ─────────────────────────────────────────────────────────
// NODES — RAG Systems (14 sessions)
// ─────────────────────────────────────────────────────────
const ragNodes = [
  {
    slug: "01-intro-rag-course",
    sectionId: "rag",
    title: "Introduction to the Complete RAG Course",
    order: 1,
    excerpt: "Course goals, why RAG matters for AI engineering, and what you will build.",
    theory: "<p>RAG — Retrieval-Augmented Generation — is the architectural pattern that separates serious AI engineering from hobbyist chatbot building. As Harish Neil, founder of OpenSlate.ai (an enterprise RAG platform processing millions of documents), explains: <em>\"If you want to land six-figure AI engineering roles, RAG isn't just a nice-to-have — it is absolutely essential.\"</em></p><p>The course covers the full RAG stack in order: fundamentals (what is RAG, what are vector databases) → complete injection and retrieval pipelines coded from scratch → a deep dive into chunking strategies → multi-query retrieval and Reciprocal Rank Fusion → hybrid search and rerankers. Each concept builds on the previous one.</p><p>One stat to remember from the opening: <strong>\"Poor chunking is the number one reason why RAG systems fail in production.\"</strong> That's the instructor's hard-won lesson from building enterprise products used by 500+ users. Chunking is where most engineers cut corners — and where the course spends the most time.</p><p>The source code for every video is open-source and free on GitHub, because the goal is immediate hands-on building, not passive watching.</p>",
    example: "Without RAG: 'What did Anthropic announce last week?' → LLM confidently makes up a plausible-sounding but wrong answer. With RAG: system retrieves last week's actual press releases → injects them into the prompt → LLM reads and accurately summarises the real announcement.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is RAG and why can't you just use a large context window instead?",
        "Name the two main pipelines in a RAG system and explain what each does.",
        "Why does chunking quality matter so much to overall RAG answer quality?",
      ],
      seniorTip: "Frame RAG as an architectural decision, not a library choice. A senior engineer explains the trade-off: context windows are growing (GPT-4.1 = 1M tokens) but enterprise data is growing faster (petabytes). RAG also provides freshness (no retraining), citation ability, and cost control — benefits a pure long-context approach can't match."
    },
    flashCards: [
      { q: "What does RAG stand for and what problem does it solve?", a: "Retrieval-Augmented Generation. It solves the context-window bottleneck by retrieving only the relevant chunks from a large knowledge base instead of dumping everything into the LLM." },
      { q: "According to the instructor, what is the #1 reason RAG systems fail in production?", a: "Poor chunking. Even perfect embeddings cannot fix poorly split content because retrieval quality depends entirely on how the content was divided." },
      { q: "What are the two high-level pipelines in a RAG system?", a: "The injection pipeline (offline: load → chunk → embed → store in vector DB) and the retrieval pipeline (real-time: embed query → similarity search → top-K chunks → LLM answer)." },
    ],
  },
  {
    slug: "02-what-is-rag",
    sectionId: "rag",
    title: "What is RAG, Tokens, Embeddings & Vector Databases",
    order: 2,
    excerpt: "Context windows, chunking, embedding models, and the injection vs retrieval pipeline.",
    theory: "<p>RAG is a method that <em>combines LLMs with a retrieval system</em> that can search through vast external information — documents, databases, or knowledge bases — whenever the LLM needs additional context to answer accurately.</p><p><strong>Why not just use a big context window?</strong> Even GPT-4.1's 1 million token window is nowhere near enough for enterprise reality: an enterprise data center holds ~1 petabyte of documents, which is <em>1.3 quintillion tokens</em>. Even a mid-sized company has 100 GB–1 TB of documents. RAG solves this by retrieving only the relevant slices.</p><p><strong>Tokens</strong> — the unit of text LLMs process. Roughly one English word = one token. 'hello' = 1 token. 'I am' = 2 tokens. Every LLM has a hard context-window limit measured in tokens.</p><p><strong>Embeddings</strong> — numeric vectors that capture semantic meaning. Similar sentences end up close together in vector space; dissimilar ones are far apart. This is what enables semantic search (finding meaning, not just keywords).</p><p><strong>The two RAG pipelines</strong>:</p><ul><li><b>Injection (offline)</b>: Source docs → <em>Chunking</em> (split into ~1,000-token pieces) → <em>Embedding</em> (each chunk becomes a vector) → <em>Vector Store</em> (e.g. ChromaDB)</li><li><b>Retrieval (real-time)</b>: User query → Embed query → Cosine similarity search → Top-K chunks → Send chunks + query to LLM → Final answer</li></ul>",
    example: "Context window analogy: an LLM with an 8K token window is like a person who can only read 8 pages at once. RAG pre-selects the most relevant 3–5 pages from your entire library before handing them over.",
    animation: "VectorSearchVisualizer",
    tool: "TokenCounter",
    interviewPrep: {
      questions: [
        "What is an embedding and how does it enable semantic search in a vector database?",
        "Walk me through the injection pipeline step by step.",
        "Why does chunk size matter? What happens if chunks are too small vs too large?",
      ],
      seniorTip: "The real senior insight is that RAG is a precision-recall trade-off. Larger chunks = higher recall (more context) but lower precision (more noise). Smaller chunks = higher precision but risk losing context across chunk boundaries. Production systems tune chunk size empirically per document type, often with overlap (e.g. 200 token overlap) to prevent context loss at boundaries."
    },
    flashCards: [
      { q: "What is a token in the context of LLMs?", a: "A unit of text the LLM processes — roughly one English word. 'hello' = 1 token, 'I am' = 2 tokens. LLMs have a hard limit on how many tokens they can process at once (the context window)." },
      { q: "What is an embedding?", a: "A numeric vector that represents the semantic meaning of text. Words/sentences with similar meanings produce similar vectors (close in vector space), enabling semantic search across a vector database." },
      { q: "What is chunking and why is 1,000 tokens a common default?", a: "Chunking breaks large documents into smaller pieces before embedding. ~1,000 tokens balances context richness (enough meaning per chunk) with retrieval precision (not so large that it adds noise)." },
      { q: "What is the difference between the injection pipeline and the retrieval pipeline?", a: "Injection is offline: load docs → chunk → embed → store in vector DB. Retrieval is real-time: embed query → cosine similarity search → top-K chunks → LLM generates answer from chunks." },
    ],
  },
  {
    slug: "03-coding-injection-pipeline",
    sectionId: "rag",
    title: "Coding the Injection Pipeline",
    order: 3,
    excerpt: "Chunk → embed → store in a vector DB. Implementing from scratch.",
    theory: "<p>The injection pipeline is the <em>offline batch process</em> that prepares your knowledge base for retrieval. Once built, it runs infrequently — only when documents change.</p><p><strong>Four steps:</strong> (1) Load source documents from a directory (PDFs, DOCX, TXT), (2) Split into chunks using a text splitter, (3) Embed each chunk into a vector using an embedding model, (4) Store the vectors in a persistent vector database.</p><p><strong>Key LangChain classes used:</strong></p><ul><li><code>DirectoryLoader</code> / <code>PyPDFDirectoryLoader</code> — load all files from a folder</li><li><code>CharacterTextSplitter</code> — split text by character count (simple baseline)</li><li><code>OpenAIEmbeddings</code> — convert text chunks to 1,536-dimensional vectors</li><li><code>Chroma</code> — local vector database (persists to disk, easy to develop with)</li></ul><p>The instructor chose <strong>ChromaDB</strong> specifically because it can be hosted locally — no API key, no cost, no network latency during development. For production, you'd evaluate Pinecone, Weaviate, or pgvector depending on scale.</p><p>Environment variables (<code>python-dotenv</code>) keep API keys out of code. Always use <code>.env</code> files and add them to <code>.gitignore</code>.</p>",
    example: "A 100-page employee handbook becomes ~500 chunks. Each chunk gets a vector. At query time, 'What is the parental leave policy?' embeds to a vector that's closest to the HR policy chunk — retrieved instantly.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why do we need to use the same embedding model in the injection pipeline and the retrieval pipeline?",
        "What is chunk_overlap and why would you set it to a non-zero value?",
        "Why would you choose ChromaDB for development but Pinecone for production?",
      ],
      seniorTip: "The dimensionality of embedding vectors must be consistent: you cannot inject with text-embedding-3-small (1,536 dims) and retrieve with text-embedding-ada-002 (also 1,536 dims but different vector space). The embedding model baked into the vector store at injection time is locked in — changing it requires re-embedding your entire corpus. Plan this decision carefully in production systems."
    },
    flashCards: [
      { q: "What are the four steps of the RAG injection pipeline?", a: "1) Load source documents, 2) Split into chunks, 3) Embed each chunk to a vector, 4) Store vectors in a persistent vector database." },
      { q: "Why must you use the same embedding model for injection and retrieval?", a: "Because vectors only make sense relative to the model that created them. Vectors from different models exist in different spaces and cosine similarity between them is meaningless." },
      { q: "What is chunk_overlap and what problem does it solve?", a: "A small window of tokens repeated at the boundary between adjacent chunks (e.g. 80 tokens). It prevents key sentences from being split mid-thought and losing context across chunk boundaries." },
    ],
  },
  {
    slug: "04-coding-retrieval-pipeline",
    sectionId: "rag",
    title: "Coding the Retrieval Pipeline",
    order: 4,
    excerpt: "Query → embed → similarity search → top-k chunks → LLM prompt → answer.",
    theory: "<p>The retrieval pipeline is the <em>real-time component</em> of RAG — it runs on every user query. It takes the user's question, finds the most relevant chunks from the vector database, and returns them for answer generation.</p><p><strong>How it works:</strong> The user query is embedded using the same model used during injection. The resulting vector is compared against all stored chunk vectors using <em>cosine similarity</em>. The top-K chunks (by similarity score) are returned.</p><p><strong>The retriever object</strong> in LangChain abstracts this process. Key configuration parameters:</p><ul><li><code>k=3</code> — return the top 3 most similar chunks (tune this: more = more context but more noise)</li><li><code>score_threshold=0.3</code> — only return chunks with similarity ≥ 0.3; prevents irrelevant chunks from slipping through when no good match exists</li><li><code>search_type='similarity'</code> — use cosine similarity (always preferred for RAG)</li></ul><p>The instructor's rule: <strong>\"Always use cosine similarity for RAG.\"</strong> Euclidean distance is sensitive to vector magnitude; cosine is not — and embedding models produce unit-normalised vectors, making cosine the natural choice.</p><p>The score threshold (0.3 is a starting point) is arrived at through trial and error. Set it too high and you'll get no results; too low and you'll return irrelevant content.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What does the K parameter control in a retriever, and what are the trade-offs of making it larger?",
        "What is a score threshold in retrieval and when would you use it?",
        "Why is cosine similarity preferred over Euclidean distance for embedding-based retrieval?",
      ],
      seniorTip: "In production, K is not a fixed number — it's tuned per use case. Customer support RAG might use K=3 for concise answers. Research RAG might use K=10. The score threshold is equally important: without it, the LLM will always get K chunks even if all are irrelevant, leading to hallucinated answers. Always implement a threshold and handle the 'no results' case gracefully in your UX."
    },
    flashCards: [
      { q: "What does the 'k' parameter in a retriever control?", a: "The number of top-scoring chunks returned. k=3 returns the 3 most similar chunks. Higher k = more context but more noise; lower k = more precise but may miss relevant information." },
      { q: "What is a score_threshold and why is it important?", a: "A minimum similarity score (0–1) a chunk must meet to be returned. Without it, the retriever always returns K chunks even if none are relevant, causing the LLM to hallucinate." },
      { q: "Why is cosine similarity always used for embedding-based RAG retrieval?", a: "Embedding models produce unit-normalised vectors (magnitude = 1), so cosine similarity (which ignores magnitude) measures pure semantic angle. Euclidean distance is thrown off by magnitude differences." },
    ],
  },
  {
    slug: "05-cosine-similarity",
    sectionId: "rag",
    title: "Cosine Similarity Explained",
    order: 5,
    excerpt: "How vector similarity is measured — the angle between embeddings explained.",
    theory: "<p>Cosine similarity is the mathematical engine behind semantic search in RAG. Once you understand it, you'll realise every vector database is essentially just computing this one formula at scale.</p><p><strong>Definition:</strong> Cosine similarity measures the <em>angle between two vectors</em>, not their magnitude. Values range from 0 (completely different) to 1 (identical meaning). If you imagine plotting two words as arrows from the origin in high-dimensional space, cosine similarity is how close those arrows point in the same direction.</p><p><strong>Formula:</strong> <code>cos(θ) = (A · B) / (|A| × |B|)</code></p><p>Where A · B is the <em>dot product</em> (element-wise multiply then sum) and |A|, |B| are the vector magnitudes (lengths).</p><p><strong>The RAG simplification:</strong> Popular embedding models (OpenAI, Cohere, etc.) produce <em>unit-normalised</em> vectors — magnitude is always exactly 1. So the denominator <code>|A| × |B| = 1 × 1 = 1</code>, and the formula simplifies to just the dot product: <code>cos(θ) = A · B</code>. This makes it extremely fast to compute.</p><p><strong>Example from the lecture:</strong> Query = 'how to train a dog' vs chunk = 'dog training techniques'. Their embeddings might be [0.6, 0.3, 0.2] and [0.7, 0.4, 0.1]. Dot product = (0.6×0.7) + (0.3×0.4) + (0.2×0.1) = 0.42 + 0.12 + 0.02 = 0.56. High similarity — the chunk gets retrieved.</p>",
    example: null,
    animation: "CosineSimilarityDemo",
    tool: null,
    interviewPrep: {
      questions: [
        "Explain cosine similarity in plain English — what does it actually measure?",
        "Why does the cosine similarity formula simplify when using popular embedding models?",
        "What is the dot product and how does it relate to cosine similarity?",
      ],
      seniorTip: "The reason cosine similarity is preferred over Euclidean distance for text embeddings: cosine only cares about <em>direction</em>, not magnitude. Two sentences that mean the same thing but are different lengths will produce vectors of different magnitudes but similar directions — cosine correctly rates them as similar while Euclidean would rate them as distant. For unit-normalised vectors, the two metrics are mathematically equivalent, but cosine is the convention in the NLP world."
    },
    flashCards: [
      { q: "What does cosine similarity measure?", a: "The angle between two vectors. 0 = completely different, 1 = identical direction (same meaning). It ignores vector magnitude — only the direction matters." },
      { q: "Why does cosine similarity simplify to just the dot product for RAG embeddings?", a: "Popular embedding models produce unit-normalised vectors (magnitude = 1). So the denominator |A| × |B| = 1, and cos(θ) = A · B (just the dot product)." },
      { q: "How is the cosine similarity score used in RAG retrieval?", a: "The query is embedded into a vector. Every chunk in the vector DB gets a cosine similarity score against that query vector. The top-K highest-scoring chunks are retrieved and sent to the LLM." },
    ],
  },
  {
    slug: "06-answer-generation-llm",
    sectionId: "rag",
    title: "Answer Generation with LLM",
    order: 6,
    excerpt: "From retrieved chunks and user question to a grounded, accurate final answer.",
    theory: "<p>Answer generation is the final step of the RAG pipeline — taking the retrieved chunks and the user's query, combining them in a prompt, and sending to an LLM to produce the final answer.</p><p><strong>The prompt structure:</strong> 'Based on the following documents, answer this question: {query}. Documents: {chunk_1}\n{chunk_2}\n...' This is called a <em>grounded prompt</em> — the LLM is explicitly given the context it should use.</p><p><strong>The key constraint:</strong> Force the LLM to answer <em>only from the retrieved documents</em>, not its training data: <em>\"If you can't find the answer in the documents, say: I don't have enough information to answer based on the provided documents.\"</em> This prevents hallucination and keeps answers traceable to sources.</p><p><strong>Code pattern:</strong> Concatenate chunks using <code>'\n'.join([doc.page_content ...])</code>, build a <code>HumanMessage</code>, add a <code>SystemMessage</code> with persona, call <code>ChatOpenAI.invoke()</code>.</p><p>From the lecture demo: query = 'What was Microsoft's first hardware product?' — the LLM correctly found 'the Microsoft Mouse, released in 1983' from the retrieved Wikipedia chunks. Without RAG, the LLM might hallucinate or give a confident but vague answer.</p>",
    example: "Without grounding: 'What is our refund policy?' → LLM invents a policy. With grounding: retrieved chunk contains the actual policy → LLM quotes it accurately.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is a 'grounded prompt' in RAG and why does it reduce hallucination?",
        "How do you handle the case where no relevant chunks are retrieved?",
        "What is the trade-off between using more retrieved chunks vs fewer?",
      ],
      seniorTip: "In production, answer generation is where you add citations. Instead of just concatenating chunk text, you include chunk metadata (source file, page number) and ask the LLM to reference sources. This transforms a black-box answer into a traceable, auditable response — critical for enterprise use cases like legal, medical, or compliance where every claim must be attributable."
    },
    flashCards: [
      { q: "What is a grounded prompt in RAG?", a: "A prompt that provides the retrieved document chunks as explicit context and instructs the LLM to answer only from those documents, preventing hallucination." },
      { q: "How do you prevent the LLM from using its own training knowledge instead of the retrieved chunks?", a: "Explicitly instruct it in the prompt: 'Answer using ONLY the provided documents. If the answer is not in the documents, say you do not have enough information.'" },
      { q: "Why should you concatenate page_content from chunks rather than passing the full Document objects?", a: "LLMs receive plain text strings in their context. page_content extracts just the text, while Document objects also contain metadata that would add noise to the prompt." },
    ],
  },
  {
    slug: "07-history-aware-conversational-rag",
    sectionId: "rag",
    title: "History-Aware Conversational RAG",
    order: 7,
    excerpt: "Multi-turn context and query reformation — making RAG work in chatbots.",
    theory: "<p>Basic RAG has a critical flaw for real-world conversations: it treats every query as independent. When a user asks a follow-up question using pronouns or references (\"What does <em>it</em> do?\"), the vector database has no idea what 'it' refers to — and retrieval fails.</p><p><strong>History-Aware RAG</strong> adds one crucial extra step before retrieval: <em>query reformulation</em>. The system looks at the full conversation history and rewrites the vague follow-up into a clear, standalone, searchable question.</p><p><strong>Example from the lecture:</strong></p><ul><li>User: 'Tell me about Nvidia's latest GPU architecture.' → AI: 'Nvidia's Hopper...'</li><li>Follow-up: 'What is <em>their</em> revenue from <em>it</em>?'</li><li>Without history-aware: vector DB searches for 'their revenue from it' → no results</li><li>With history-aware: reformulated to 'What is Nvidia's revenue from the Hopper GPU architecture?' → relevant chunks retrieved</li></ul><p><strong>Implementation:</strong> Maintain a <code>chat_history</code> list of <code>HumanMessage</code> and <code>AIMessage</code> objects. Before each retrieval, pass the latest question + history to a 'question condenser' LLM chain that rewrites it. Then use the rewritten query for vector search.</p><p>LangChain provides <code>create_history_aware_retriever</code> and <code>create_retrieval_chain</code> to compose this cleanly.</p>",
    example: "History: 'What is RAG?' → Answer explained. Follow-up: 'Give me a code example of that.' → Reformulated: 'Give me a Python code example of Retrieval-Augmented Generation.' → RAG retrieves relevant code chunks.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is query reformulation in history-aware RAG and why is it necessary?",
        "How do you store conversation history in a LangChain RAG chain?",
        "What happens to retrieval quality without history-awareness when users ask follow-up questions?",
      ],
      seniorTip: "Query reformulation is essentially a small LLM call before the main LLM call — meaning history-aware RAG has 2x LLM invocations per turn. For latency-sensitive products, you can optimise: only reformulate when the current query contains pronouns or references (detectable with a simple classifier), skip reformulation for first questions. This halves latency for the majority of queries."
    },
    flashCards: [
      { q: "What is query reformulation in history-aware RAG?", a: "Rewriting a follow-up question that uses pronouns or context references into a standalone, self-contained question that can be understood by the vector database without conversation history." },
      { q: "Why does basic RAG fail on follow-up questions like 'What does it do?'", a: "Vector databases match text semantically. Pronouns like 'it' or 'they' have no clear semantic meaning without context — so the embedding fails to find relevant chunks." },
      { q: "What data structure is used to track conversation history in LangChain?", a: "A list of HumanMessage and AIMessage objects. Each turn appends the user's input as HumanMessage and the AI's response as AIMessage, building up the conversation context." },
    ],
  },
  {
    slug: "08-chunking-strategies-overview",
    sectionId: "rag",
    title: "Chunking Strategies Overview",
    order: 8,
    excerpt: "Why chunking is the most impactful RAG decision — fixed vs semantic vs agentic.",
    theory: "<p>Chunking is the critical second step in the injection pipeline — it determines how content gets divided for retrieval. As the instructor puts it: <em>\"Bad chunking breaks everything downstream. Even perfect embeddings cannot fix poorly split content.\"</em></p><p><strong>Why basic (character) chunking fails:</strong> It cuts at fixed character counts regardless of meaning. Example from lecture — a Tesla financial document chunk ends at 'production cost rose by 12% due to supply chain' and the next chunk starts at 'Challenges and inflation' — same topic, split in two, context lost.</p><p><strong>Problems with bad chunking:</strong> splits mid-sentence, breaks related concepts, loses cross-chunk context, ruins retrieval quality even with good embeddings.</p><p><strong>The 5 chunking strategies (simple → sophisticated):</strong></p><ol><li><b>Character Text Splitter</b> — split at fixed character count with separator. Fast, simple, fine for uniform/short documents.</li><li><b>Recursive Character Text Splitter</b> — tries natural boundaries first (paragraphs → sentences → words). Smarter fallback, better context preservation.</li><li><b>Document-Specific Splitting</b> — respects document structure (PDF pages, Markdown headers, CSV rows). Each file type gets appropriate treatment.</li><li><b>Semantic Chunking</b> — uses embeddings to detect topic shifts and split where meaning changes. Smart but computationally expensive.</li><li><b>Agentic Chunking</b> — LLM analyzes content and decides optimal splits. Most accurate, slowest, most expensive. Best for complex unstructured documents.</li></ol>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Name the five chunking strategies from simple to sophisticated and explain when to use each.",
        "What are the consequences of chunk size being too small vs too large?",
        "Why can't you fix bad chunking with better embeddings?",
      ],
      seniorTip: "In production, chunking strategy is rarely a one-size decision — it's a per-document-type decision. A real enterprise RAG system might use character splitting for clean FAQ text, recursive splitting for normal documents, and unstructured.io with layout detection for complex PDFs with tables and images. The pipeline needs to detect document type and route accordingly. This routing logic is often the most valuable engineering work in a production RAG system."
    },
    flashCards: [
      { q: "What are the five chunking strategies in order of sophistication?", a: "1) Character Text Splitter, 2) Recursive Character Text Splitter, 3) Document-Specific Splitting, 4) Semantic Chunking, 5) Agentic Chunking." },
      { q: "What is the main problem with Character Text Splitting for complex documents?", a: "It cuts at fixed character counts regardless of meaning, often splitting mid-sentence or breaking related concepts across chunks, destroying the context the embedding needs to be useful." },
      { q: "Why is agentic chunking the most accurate but least practical for production?", a: "An LLM analyzes content and decides split points — highly accurate because it understands meaning. But it requires one LLM call per chunk decision, making it extremely slow and expensive at scale." },
    ],
  },
  {
    slug: "09-character-recursive-splitter",
    sectionId: "rag",
    title: "Character & Recursive Text Splitter",
    order: 9,
    excerpt: "The simplest chunking methods — when to use each and their trade-offs.",
    theory: "<p><strong>Character Text Splitter</strong> follows a <em>split-first, merge-second</em> approach, not a simple character-count slice:</p><ol><li><b>Split</b>: Break the entire text at the separator (default: double newline <code>\\n\\n</code>) into pieces.</li><li><b>Merge</b>: Combine pieces sequentially until the chunk size limit is reached. When adding the next piece would exceed the limit, draw a boundary and start a new chunk.</li></ol><p><strong>Example from the lecture</strong>: <code>chunk_size=100</code>, separator = double newline. Pieces of sizes 18, 51, 19, 78, 21, 62 chars. Pieces 1+2+3 = 88 chars (under 100), merged. Adding piece 4 (78) would exceed 100, so boundary drawn. Piece 4+5 = 99, merged. And so on.</p><p><strong>Recursive Character Text Splitter</strong> is the smarter upgrade. Instead of a single separator, it has a <em>priority list of separators</em>: tries paragraph breaks (<code>\\n\\n</code>) first, then sentence breaks (<code>\\n</code>), then spaces, then single characters as a last resort. This preserves natural language boundaries much better.</p><p>The instructor notes: character splitter is fine for simple, uniform documents (FAQs, structured text). For anything more complex — mixed content, long paragraphs — switch to the recursive version as your baseline.</p>",
    example: "LangChain's RecursiveCharacterTextSplitter with chunk_size=1000, chunk_overlap=200: overlap ensures continuity between adjacent chunks — critical for questions that span chunk boundaries.",
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Explain the split-first, merge-second algorithm of CharacterTextSplitter.",
        "What is the key difference between CharacterTextSplitter and RecursiveCharacterTextSplitter?",
        "What separator does CharacterTextSplitter use by default and why?",
      ],
      seniorTip: "RecursiveCharacterTextSplitter is the correct default for 90% of RAG use cases — LangChain documentation recommends it as the starting point. In practice, you almost always want paragraph → sentence → word fallback rather than a hard character cut. The key tunable is chunk_overlap: set it to 10-15% of chunk_size (e.g. 100 overlap for 800 chunk_size) to maintain context across boundaries."
    },
    flashCards: [
      { q: "What is the 'split-first, merge-second' algorithm in CharacterTextSplitter?", a: "First split the entire text at the separator into pieces. Then combine adjacent pieces until adding the next one would exceed chunk_size. When the limit is reached, draw a chunk boundary and start fresh." },
      { q: "What separators does RecursiveCharacterTextSplitter try, in order?", a: "Double newline (paragraphs) → single newline (sentences) → space (words) → single character. It tries the largest natural boundary first and falls back to smaller ones if needed." },
      { q: "What is the default separator for CharacterTextSplitter and what does it represent?", a: "Double newline (\\n\\n), which represents a blank line between paragraphs. This is the most common natural boundary in plain text documents." },
    ],
  },
  {
    slug: "10-semantic-chunking",
    sectionId: "rag",
    title: "Semantic Chunking",
    order: 10,
    excerpt: "Meaning-preserving chunks using embedding similarity between adjacent sentences.",
    theory: "<p>Semantic chunking moves beyond character-count heuristics and uses <em>embeddings themselves</em> to decide where to split. The idea: split where the <em>meaning changes</em>, not where the character count runs out.</p><p><strong>Three-step process:</strong></p><ol><li><b>Sentence-level embedding</b>: Convert each individual sentence into a vector.</li><li><b>Pairwise similarity</b>: Calculate cosine similarity between consecutive sentences (sentence 1 vs 2, sentence 2 vs 3, etc.). This builds a similarity profile over the document.</li><li><b>Breakpoint detection</b>: Find where the similarity score drops <em>significantly</em> (not just slightly). That drop signals a topic change → draw a chunk boundary there.</li></ol><p><strong>The breakpoint threshold type</strong> controls sensitivity: 'percentile' (split at the bottom X% of similarity scores), 'standard_deviation', or 'interquartile'. 'Percentile' is the most common.</p><p><strong>Instructor's honest take:</strong> <em>\"Personally, I would never use this in production.\"</em> Why? It uses the embedding model during the injection step itself — meaning you pay embedding API costs twice (once for chunking, once for storing). For large corpora, this doubles your processing cost. Use it for learning and interviews, but in production prefer recursive splitting + good overlap.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "How does semantic chunking decide where to split a document?",
        "What is the cost disadvantage of semantic chunking vs character-based methods?",
        "When would you choose semantic chunking over recursive character splitting?",
      ],
      seniorTip: "Semantic chunking is computationally expensive because it embeds every sentence. For a 1,000-page document corpus with average 20 sentences per page, that's 20,000 embedding calls just for chunking — before you even start the retrieval pipeline. A cost-conscious senior engineer would benchmark recursive splitting with good overlap vs semantic chunking and choose semantic only if the quality improvement is measurable and worth the cost."
    },
    flashCards: [
      { q: "How does semantic chunking decide where to split?", a: "It embeds each sentence individually, computes cosine similarity between consecutive sentence pairs, and draws chunk boundaries where similarity drops significantly — indicating a topic change." },
      { q: "What is the breakpoint_threshold_type parameter in SemanticChunker?", a: "Controls how significant a similarity drop must be to trigger a split. Options: percentile (split at bottom X% drops), standard_deviation, interquartile. Percentile is most common." },
      { q: "Why would a production engineer avoid semantic chunking for large corpora?", a: "It uses the embedding model during chunking itself, effectively doubling embedding API costs. For millions of sentences, this becomes prohibitively expensive compared to pure text-based splitting." },
    ],
  },
  {
    slug: "11-agentic-chunking",
    sectionId: "rag",
    title: "Agentic Chunking",
    order: 11,
    excerpt: "LLM-driven chunking with dynamic metadata — the highest-quality approach.",
    theory: "<p>Agentic chunking is the most sophisticated approach: an LLM itself reads the document and decides where the natural chunk boundaries should be.</p><p><strong>How it works:</strong> You craft a prompt instructing the LLM to act as a \"text chunking expert.\" The prompt includes rules (max chunk size, split at natural topic boundaries, keep related information together) and a special <em>split keyword</em> (e.g. <code>SPLIT_HERE</code>). The LLM reads the text and inserts this keyword wherever it decides a chunk boundary should go. Your code then programmatically splits on that keyword.</p><p><strong>Example from the lecture:</strong> Tesla Q3 earnings text, with instruction to chunk to ~200 characters at natural topic boundaries. The LLM correctly grouped 'deliveries and production' in one chunk and 'Model Y performance' in another — because it understood the semantic relationships, not just the character count.</p><p><strong>The trade-off:</strong> The instructor explicitly says he would <em>not</em> use any of the four simpler strategies for <em>complex enterprise PDFs</em> (with images, tables, complex layouts). For those, he'd use <strong>unstructured.io</strong> — a library that uses OCR, table transformers, and layout detection models to extract and structure content before chunking. Agentic chunking is powerful but impractical at scale due to LLM costs.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "How does agentic chunking work and what makes it more accurate than character-based splitting?",
        "What is the key drawback that makes agentic chunking impractical for large document corpora?",
        "For complex enterprise PDFs with tables and images, what would you use instead of the four basic chunking strategies?",
      ],
      seniorTip: "The instructor's real production advice: for complex unstructured PDFs, use unstructured.io (open-source). It uses OCR for scanned pages, table transformers to extract tables as structured data, and layout detection to understand column layouts, headers, and figures. It converts visually complex PDFs into clean, structured text that standard chunking strategies can then handle effectively. This is what enterprise RAG teams actually use."
    },
    flashCards: [
      { q: "How does agentic chunking work at a high level?", a: "An LLM reads the document with a prompt asking it to insert a SPLIT_HERE keyword at natural chunk boundaries. Your code then splits the LLM's output on that keyword to get semantically coherent chunks." },
      { q: "Why is agentic chunking the most accurate chunking method?", a: "An LLM understands the semantic content and relationships between paragraphs. It can group related information together and split at genuine topic changes — unlike character or even embedding-based methods." },
      { q: "What library does the instructor recommend for complex enterprise PDFs?", a: "unstructured.io — it uses OCR, table transformers, and layout detection models to extract and structure content from visually complex PDFs before any chunking strategy is applied." },
    ],
  },
  {
    slug: "12-multimodal-rag",
    sectionId: "rag",
    title: "Multi-Modal RAG with Images and Documents",
    order: 12,
    excerpt: "Embedding and retrieving images alongside text using unified vector spaces.",
    theory: "<p>Real business documents contain charts, diagrams, and screenshots. Multi-Modal RAG handles this via unified embedding models like CLIP that map both text and images to the same vector space.</p><p>This enables cross-modal retrieval: a text query can find a relevant image, and an image query can find related text. Retrieved images are then passed to a vision-capable LLM (GPT-4o, Claude) to generate a grounded answer.</p>",
    example: "User: 'What does the Q3 revenue chart show?' → Text query embeds to a vector → Matches the Q3 chart's image embedding → Chart passed to vision LLM → 'Revenue grew 23% from Q2 to Q3, driven by...'",
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "13-advanced-document-retrieval",
    sectionId: "rag",
    title: "Advanced Document Retrieval Techniques",
    order: 13,
    excerpt: "Hybrid search (vector + BM25), Reciprocal Rank Fusion, and rerankers.",
    theory: "<p>Pure vector search is great for semantic meaning but fails for exact keyword matching (product IDs, names, codes). <b>Hybrid Search</b> runs two parallel searches:</p><ul><li>Dense (vector) search: semantic understanding</li><li>Sparse (BM25 keyword) search: exact term matching</li></ul><p>Results are fused via <b>Reciprocal Rank Fusion (RRF)</b>: documents appearing high in both lists get boosted scores. A <b>Reranker</b> model (Cohere, cross-encoder) then scores the fused list to find the absolute best context.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why is pure vector search insufficient for all retrieval scenarios?",
        "What is Reciprocal Rank Fusion and why is it preferred over score normalisation?",
        "What does a reranker do and how is it different from the retriever?",
      ],
      seniorTip: "Hybrid search is the production standard in enterprise RAG. RRF is preferred over score normalisation because different retrieval systems produce incompatible score scales — RRF only uses rank positions, which are universally comparable. A reranker is a cross-encoder that jointly considers query + document, far more accurate than bi-encoder embeddings but ~10× slower, so it's applied to just the top-20 candidates."
    },
  },
  {
    slug: "14-multi-query-rag",
    sectionId: "rag",
    title: "Multi-Query RAG for Better Search Results",
    order: 14,
    excerpt: "One user query → multiple LLM-generated reformulations → merged and reranked.",
    theory: "<p>Users phrase questions poorly — ambiguous, incomplete, or using different vocabulary than the documents. Multi-Query RAG intercepts and expands:</p><ol><li>LLM generates 3–5 diverse reformulations of the original question</li><li>Each reformulation independently searches the vector DB</li><li>All retrieved chunks are pooled and de-duplicated</li><li>A reranker scores the combined pool to find the best context</li></ol><p>Net effect: dramatically higher recall — questions that would miss with one phrasing succeed with an alternative.</p>",
    example: "User: 'side effects?' → LLM generates: ['List all adverse reactions', 'What are contraindications?', 'When should this medication not be taken?'] → 3× the retrieval coverage across different document sections.",
    animation: null,
    tool: null,
    interviewPrep: null,
  },
];

// ─────────────────────────────────────────────────────────
// NODES — LangChain (16 sessions)
// ─────────────────────────────────────────────────────────
const langchainNodes = [
  {
    slug: "01-introduction",
    sectionId: "langchain",
    title: "Introduction to LangChain",
    order: 1,
    excerpt: "What LangChain is and why it exists — the standard framework for LLM apps.",
    theory: "<p>LangChain is an open-source framework for building AI-powered applications using Large Language Models. Whether you're a complete beginner or an experienced developer, the course takes you from zero — understanding what LangChain solves — all the way to building sophisticated, production-ready applications.</p><p>The framework's core value proposition: LLMs are powerful but raw. LangChain provides the scaffolding to connect models to real tools, memory, external data, and multi-step reasoning workflows — turning what would be a custom-coded mess into composable, reusable building blocks.</p><p>The course covers LangChain's three most important core components:</p><ul><li><b>Chat Models</b> — structured interface to LLMs (OpenAI, Anthropic, Gemini, Ollama)</li><li><b>Prompt Templates</b> — dynamic, reusable, testable prompt construction</li><li><b>Chains</b> — composing multiple steps into a single pipeline using LCEL (LangChain Expression Language)</li></ul><p>All source code is provided. The fastest way to get value: clone the repo, follow along, and build while watching.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What problem does LangChain solve that you couldn't solve just by calling the OpenAI API directly?",
        "Name the three core components of LangChain covered in this course.",
        "Why would an enterprise use LangChain over custom API integration code?",
      ],
      seniorTip: "LangChain's real production value is not the chat model wrapper (which is a thin abstraction over direct API calls). It's the ecosystem: standardised interfaces mean you can swap GPT-4 for Claude for Gemini without changing your business logic. This vendor independence is critical in enterprise contracts where model choice may be dictated by security, cost, or compliance requirements."
    },
    flashCards: [
      { q: "What is LangChain?", a: "An open-source framework for building AI applications using LLMs. It provides standardised, composable building blocks for connecting models to tools, memory, data, and multi-step pipelines." },
      { q: "What are the three core LangChain components covered in this course?", a: "Chat Models (structured interface to LLMs), Prompt Templates (dynamic prompt construction), and Chains (composing steps into pipelines using LCEL)." },
    ],
  },
  {
    slug: "02-overview",
    sectionId: "langchain",
    title: "LangChain Overview",
    order: 2,
    excerpt: "Core components: models, prompts, chains, memory, agents, tools.",
    theory: "<p>The LangChain crash course covers four main learning areas, each building on the previous:</p><ol><li><b>What is LangChain</b> — the problem it solves, the abstraction it provides</li><li><b>Chat Models</b> — the first core component: how to interact with LLMs using structured message objects (SystemMessage, HumanMessage, AIMessage)</li><li><b>Prompt Templates</b> — the second core component: building reusable, parameterised prompt structures rather than hard-coded strings</li><li><b>Chains</b> — the third and most powerful component: composing models, prompts, and other tools into sequential pipelines with LCEL's pipe operator (<code>|</code>)</li></ol><p>Each component is introduced with a practical coding example. The course style is deliberately concise — theory is explained only as much as needed to understand the code, then you build immediately. This mirrors how effective engineers learn: by building and encountering problems, not by memorising concepts first.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What does LCEL stand for and what problem does it solve?",
        "Why are the three components (Models, Prompts, Chains) covered in that specific order?",
        "What is the difference between a ChatModel and a raw LLM in LangChain?",
      ],
      seniorTip: "LCEL (LangChain Expression Language) deserves special attention. The pipe operator composes steps functionally: <code>chain = prompt | model | parser</code>. This is not just syntactic sugar — LCEL components implement a common Runnable interface, enabling parallel execution, streaming, automatic retry, and observability. Understanding LCEL is what separates junior LangChain users from engineers who can build production-grade pipelines."
    },
    flashCards: [
      { q: "What are the four areas covered in this LangChain crash course?", a: "1) What is LangChain and why use it, 2) Chat Models (LLM interface), 3) Prompt Templates (reusable prompts), 4) Chains (composing steps with LCEL)." },
      { q: "What is LCEL?", a: "LangChain Expression Language — a functional composition syntax using the | (pipe) operator to chain models, prompts, and tools. Components implement a common Runnable interface with built-in streaming and parallelism." },
    ],
  },
  {
    slug: "03-what-is-langchain",
    sectionId: "langchain",
    title: "What is LangChain?",
    order: 3,
    excerpt: "The Runnable interface, LCEL expression language, and composability philosophy.",
    theory: "<p>The lecture uses a perfect analogy to explain LangChain's purpose: imagine asking ChatGPT to plan a vacation — 'I want to go to Paris this Saturday, book my flight, book a hotel, and suggest restaurants.' ChatGPT responds: <em>'I cannot make bookings directly, but I can help you plan.'</em></p><p>That limitation is the core problem LangChain solves. Raw LLMs are <em>stateless text processors</em> — they can think and write, but they cannot act. They can't call APIs, book flights, query databases, or remember previous conversations.</p><p><strong>LangChain's solution:</strong> It's an orchestration framework that connects LLMs to:</p><ul><li><b>Tools</b> — external APIs, databases, search engines, calculators</li><li><b>Memory</b> — conversation history, long-term user preferences</li><li><b>Chains</b> — multi-step workflows where the output of one step feeds the next</li><li><b>Agents</b> — LLMs that decide which tools to call and in what order</li></ul><p>The vacation example resolved with LangChain: an agent could call a flight search API, check hotel availability, query a restaurant recommendation database, and compose a complete travel plan — all from a single natural language request.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What fundamental limitation of raw LLMs does LangChain address?",
        "What is the difference between a Chain and an Agent in LangChain?",
        "Give a real-world example where an LLM alone would fail but LangChain with tools would succeed.",
      ],
      seniorTip: "The vacation planning analogy reveals LangChain's architectural role: it's not an LLM, it's an <em>orchestration layer</em>. In system design interviews, the key insight is that LangChain separates <em>reasoning</em> (LLM's job) from <em>action</em> (tools' job). This maps directly to the ReAct pattern (Reason + Act) which is the foundation of modern LLM agents. LangChain implements ReAct as a first-class abstraction."
    },
    flashCards: [
      { q: "What can raw LLMs NOT do that LangChain enables?", a: "LLMs are stateless text processors — they can reason and write but cannot call APIs, query databases, remember conversations, or take real-world actions. LangChain connects them to tools, memory, and multi-step workflows." },
      { q: "Using the vacation analogy: why does ChatGPT fail and how does LangChain fix it?", a: "ChatGPT says 'I cannot make bookings directly' because it has no tool access. LangChain enables an LLM agent to actually call flight search APIs, hotel booking APIs, and restaurant DBs — turning reasoning into action." },
      { q: "What is the difference between a LangChain Chain and an Agent?", a: "A Chain is a fixed sequence of steps (always executes the same steps in the same order). An Agent uses the LLM to dynamically decide which tools to call and in what order, based on the current situation." },
    ],
  },
  {
    slug: "04-prerequisites",
    sectionId: "langchain",
    title: "Prerequisites",
    order: 4,
    excerpt: "Python basics, API keys, .env setup — everything before you write LangChain code.",
    theory: "<p>Before building with LangChain, you need a working foundation in three areas:</p><ul><li><b>Python 3.8+</b> — the course uses Python exclusively; any version 3.8 or higher works</li><li><b>pip</b> — Python's package manager for installing LangChain and its dependencies</li><li><b>API keys</b> — at minimum an OpenAI API key (for GPT models). Optional: Anthropic, Google Gemini, or Groq keys if you want to test alternative providers</li></ul><p>You do NOT need deep Python expertise — if you know functions, loops, and basic OOP you have enough to follow along. The course explains every new concept as it appears.</p><p>A code editor (VS Code recommended), basic terminal comfort, and willingness to install packages are the practical requirements. Everything else is learned during the course.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why do LangChain projects always use virtual environments?",
        "What is the minimum Python version required for LangChain?",
        "Why would you want API keys for multiple LLM providers (OpenAI AND Anthropic)?",
      ],
      seniorTip: "The instructor's implicit advice here maps to production practice: never hardcode API keys in source files. Always use environment variables (python-dotenv in development, secrets management services like AWS Secrets Manager or GCP Secret Manager in production). LangChain reads from environment variables automatically for the major providers (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.) — this is intentional design for 12-factor app compliance."
    },
    flashCards: [
      { q: "What are the three prerequisites for this LangChain course?", a: "Python 3.8+ installed, pip (package manager), and at least one LLM provider API key (e.g. OpenAI API key)." },
      { q: "Why should API keys never be hardcoded in Python source files?", a: "Source files often end up in version control (Git). Hardcoded secrets are exposed in commit history and can be scraped by automated tools. Use environment variables and .env files (not committed to Git) instead." },
    ],
  },
  {
    slug: "05-dev-environment-setup",
    sectionId: "langchain",
    title: "Dev Environment Setup",
    order: 5,
    excerpt: "virtualenv, installing langchain-openai, and .env management best practices.",
    theory: "<p>The course uses a clean, minimal setup pattern that mirrors professional Python development:</p><ol><li><b>Create project folder</b>: <code>mkdir langchain-crash-course && cd langchain-crash-course</code></li><li><b>Virtual environment</b>: <code>python -m venv venv</code> then activate it. This isolates your project dependencies from global Python packages.</li><li><b>Install packages</b>: <code>pip install langchain langchain-openai python-dotenv</code></li><li><b>Create .env file</b>: Store <code>OPENAI_API_KEY=sk-...</code> here. Never commit this file — add it to <code>.gitignore</code>.</li><li><b>Load env vars in code</b>: <code>from dotenv import load_dotenv; load_dotenv()</code></li></ol><p>The activation command differs by OS: Mac/Linux uses <code>source venv/bin/activate</code>, Windows uses <code>venv\\Scripts\\activate</code>. Once activated, your terminal prompt shows <code>(venv)</code> — all pip installs go into the isolated environment.</p><p>VS Code tip: the instructor opens the project folder directly in VS Code (<code>code .</code>) and uses the integrated terminal. Keeps everything in one place.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is a Python virtual environment and why do you always use one for LangChain projects?",
        "How do you load environment variables from a .env file in Python?",
        "What packages are required for basic LangChain + OpenAI usage?",
      ],
      seniorTip: "Virtual environments prevent dependency hell — the situation where project A needs langchain==0.1 and project B needs langchain==0.3 and they can't coexist in global Python. In production, this isolation is handled by Docker containers. For larger teams, consider <code>poetry</code> or <code>uv</code> instead of plain venv — they provide lock files, dependency resolution, and reproducible builds across machines."
    },
    flashCards: [
      { q: "What command creates and activates a Python virtual environment on Mac/Linux?", a: "Create: python -m venv venv. Activate: source venv/bin/activate. You'll see (venv) in your terminal prompt. On Windows: venv\\Scripts\\activate." },
      { q: "What three packages do you install for basic LangChain + OpenAI usage?", a: "langchain, langchain-openai, python-dotenv. Then create a .env file with OPENAI_API_KEY=sk-... and call load_dotenv() at the start of your script." },
      { q: "Why add .env to .gitignore?", a: "The .env file contains API keys and secrets. If committed to Git, they're exposed in version history and potentially public repositories. Automated tools scan GitHub for leaked keys." },
    ],
  },
  {
    slug: "06-chat-models-overview",
    sectionId: "langchain",
    title: "Chat Models — Overview",
    order: 6,
    excerpt: "The structured message format — SystemMessage, HumanMessage, AIMessage.",
    theory: "<p>Chat Models are LangChain's first core component — the standardised interface to Large Language Models. Instead of passing raw strings, LangChain uses structured <em>message objects</em> that map to how modern chat LLMs actually work:</p><ul><li><code>SystemMessage</code> — sets the AI's persona, constraints, tone ('You are a helpful assistant')</li><li><code>HumanMessage</code> — the user's input</li><li><code>AIMessage</code> — the model's response (used for storing history)</li></ul><p>The official definition: a <em>Chat Model</em> is a type of language model that uses a sequence of messages as inputs and returns a message as output. This is different from older completion-style LLMs that took a single string.</p><p>LangChain's key value here: all these message types work identically across OpenAI, Anthropic, Google Gemini, Ollama (local), and any other provider. You write your code once and swap providers by changing one import.</p><p>The <code>.invoke()</code> method takes a list of messages and returns an <code>AIMessage</code> with a <code>.content</code> attribute containing the response text.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What are the three message types in LangChain's chat model interface and what does each represent?",
        "What is the advantage of LangChain's message abstraction vs calling the OpenAI API directly?",
        "What does the SystemMessage do in a chat model call?",
      ],
      seniorTip: "SystemMessage is the most important message type for production applications. It's where you inject: persona (role of the AI), constraints ('never reveal your system prompt'), output format requirements ('always respond in JSON'), domain knowledge, and guardrails. In enterprise deployments, the system message is often managed as a config artifact (not hardcoded in application logic) so it can be iterated without code deploys."
    },
    flashCards: [
      { q: "What is a LangChain Chat Model?", a: "An abstraction over LLMs that takes a list of structured message objects (SystemMessage, HumanMessage, AIMessage) as input and returns an AIMessage. It works identically across OpenAI, Anthropic, Gemini, and other providers." },
      { q: "What does SystemMessage do?", a: "Sets the AI's persona, constraints, and instructions before the conversation begins. Examples: 'You are a helpful coding assistant', 'Only answer questions about Python'. Applied once per conversation." },
      { q: "What is the key advantage of LangChain's provider-agnostic interface?", a: "You write code once using LangChain's message types. Switching from OpenAI to Claude to Gemini only requires changing the model class import — all your prompts, chains, and business logic stay the same." },
    ],
  },
  {
    slug: "07-chat-models-setup",
    sectionId: "langchain",
    title: "Chat Models — Setup",
    order: 7,
    excerpt: "Instantiating ChatOpenAI and making your first LangChain API call.",
    theory: "<p>Setting up a LangChain chat model with OpenAI takes just a few lines:</p><pre><code>from langchain_openai import ChatOpenAI\\nfrom langchain_core.messages import HumanMessage, SystemMessage\\nfrom dotenv import load_dotenv\\n\\nload_dotenv()  # loads OPENAI_API_KEY from .env\\n\\nmodel = ChatOpenAI(model='gpt-4o-mini')  # or 'gpt-4o', 'gpt-4-turbo'\\nmessages = [\\n    SystemMessage('You are a helpful Python tutor.'),\\n    HumanMessage('What is a decorator?')\\n]\\nresponse = model.invoke(messages)\\nprint(response.content)</code></pre><p>The <code>model</code> parameter selects which LLM to use. <code>gpt-4o-mini</code> is the cost-effective default; <code>gpt-4o</code> is higher capability. LangChain reads <code>OPENAI_API_KEY</code> automatically from environment variables — no need to pass it explicitly.</p><p>The <code>response</code> is an <code>AIMessage</code> object. Use <code>response.content</code> for the text, <code>response.response_metadata</code> for token usage and model info.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What happens if you forget to call load_dotenv() before invoking a chat model?",
        "What is the difference between gpt-4o-mini and gpt-4o in terms of when to use each?",
        "How do you access the text content of a LangChain model response?",
      ],
      seniorTip: "Model selection is a cost-performance trade-off. In production, use gpt-4o-mini (or equivalent) for high-volume, straightforward tasks (summarisation, classification, RAG answer generation). Reserve gpt-4o or claude-3-5-sonnet for complex reasoning tasks (code review, multi-step planning, nuanced analysis). A typical architecture routes requests to cheaper models by default and escalates to expensive models only when the cheaper model indicates low confidence."
    },
    flashCards: [
      { q: "What import do you use to set up a LangChain chat model with OpenAI?", a: "from langchain_openai import ChatOpenAI. Then model = ChatOpenAI(model='gpt-4o-mini'). LangChain reads OPENAI_API_KEY automatically from environment variables." },
      { q: "How do you get the text content from a LangChain model response?", a: "response = model.invoke(messages) returns an AIMessage object. Use response.content for the text string. response.response_metadata contains token counts and model info." },
      { q: "Why use gpt-4o-mini over gpt-4o for most production tasks?", a: "gpt-4o-mini is ~10x cheaper with 80% of the capability for standard tasks. Use gpt-4o only when complex reasoning, nuanced analysis, or maximum accuracy is required — otherwise optimise for cost." },
    ],
  },
  {
    slug: "08-chat-models-history",
    sectionId: "langchain",
    title: "Chat Models — Passing Chat History",
    order: 8,
    excerpt: "How LLMs simulate memory — passing the full conversation list each call.",
    theory: "<p>LLMs are <em>stateless APIs</em> — each call is completely independent. The model has no memory of previous exchanges. To create a conversational experience, you must explicitly pass the entire conversation history in every call.</p><p><strong>Pattern:</strong> Maintain a <code>chat_history</code> list. After each turn, append the user's <code>HumanMessage</code> and the AI's <code>AIMessage</code>. On the next call, prepend history to the messages list.</p><pre><code>chat_history = []\\n\\ndef chat(user_input):\\n    messages = [SystemMessage('You are a helpful assistant.')] + chat_history + [HumanMessage(user_input)]\\n    response = model.invoke(messages)\\n    chat_history.append(HumanMessage(user_input))\\n    chat_history.append(AIMessage(response.content))\\n    return response.content</code></pre><p>This is why LLM conversation UIs like ChatGPT send the full history on every request — they're building this list and passing it each time. The context window limit is the practical ceiling: long enough conversations hit the token limit and older messages must be truncated or summarised.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why do LLMs not remember previous messages without explicit history passing?",
        "What is the structure of messages passed when you include chat history?",
        "What happens when a conversation grows longer than the model's context window?",
      ],
      seniorTip: "In production, in-memory chat_history is insufficient — it resets on every server restart or when the serverless function spins down. Production systems store history in a database (Redis for speed, PostgreSQL for persistence) keyed by session_id. LangChain provides <code>RedisChatMessageHistory</code> and similar out-of-the-box integrations. This connects directly to the next lesson on cloud-persisted history."
    },
    flashCards: [
      { q: "Why must you pass the full conversation history on every LLM call?", a: "LLMs are stateless APIs — each call is completely independent. The model has no memory of previous exchanges unless you explicitly include them in the messages list." },
      { q: "What is the pattern for maintaining conversation history in LangChain?", a: "Maintain a chat_history list. After each turn, append HumanMessage(user_input) and AIMessage(response.content). On each call, construct: [SystemMessage] + chat_history + [HumanMessage(current_input)]." },
      { q: "What is the practical upper limit on conversation history length?", a: "The model's context window token limit. When exceeded, older messages must be truncated, summarised, or stored externally. GPT-4o has 128K tokens; Claude 3.5 has 200K tokens." },
    ],
  },
  {
    slug: "09-chat-models-alternative-llms",
    sectionId: "langchain",
    title: "Chat Models — Alternative LLMs",
    order: 9,
    excerpt: "Swapping providers with one line — Anthropic, Cohere, local Ollama.",
    theory: "<p>One of LangChain's most powerful features: switching between LLM providers requires changing only one import. The rest of your code — message types, chains, prompt templates — stays identical.</p><p><strong>Provider examples:</strong></p><ul><li><code>ChatOpenAI</code> (<code>langchain-openai</code>) — GPT-4o, GPT-4o-mini</li><li><code>ChatAnthropic</code> (<code>langchain-anthropic</code>) — Claude 3.5, Claude 3 Haiku</li><li><code>ChatGoogleGenerativeAI</code> (<code>langchain-google-genai</code>) — Gemini 1.5 Pro/Flash</li><li><code>ChatOllama</code> (<code>langchain-ollama</code>) — local models (Llama 3, Mistral, etc.)</li><li><code>ChatGroq</code> (<code>langchain-groq</code>) — fast inference (Llama, Mixtral on Groq)</li></ul><p>The pattern is always the same: install the provider-specific package, import the Chat class, initialise with model name, then call <code>.invoke(messages)</code> identically.</p><p><strong>Ollama (local models):</strong> No API key needed. Runs entirely on your machine. Great for privacy-sensitive development, offline use, or cost-free experimentation with open-source models like Llama 3.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "How does LangChain enable switching between OpenAI and Anthropic with minimal code changes?",
        "What is Ollama and when would you use it instead of a cloud provider?",
        "What are the factors to consider when choosing between different LLM providers?",
      ],
      seniorTip: "Provider abstraction is architecturally valuable for two reasons: (1) <em>Cost optimisation</em> — route different request types to cost-appropriate models. (2) <em>Vendor risk management</em> — never build in hard dependency on one provider's API. In production, implement a 'model registry' pattern where model selection is configuration, not hardcoded. This lets you hot-swap providers in response to outages, price changes, or new model releases without code deployments."
    },
    flashCards: [
      { q: "How do you switch from OpenAI to Claude in LangChain?", a: "Change one import: replace 'from langchain_openai import ChatOpenAI' with 'from langchain_anthropic import ChatAnthropic' and swap the model init. All messages, chains, and templates stay identical." },
      { q: "What is Ollama and what is its main advantage?", a: "A tool to run open-source LLMs (Llama 3, Mistral, etc.) locally on your machine. No API key needed, no cost, complete privacy — all inference runs on your hardware." },
      { q: "What are the four main factors when choosing an LLM provider?", a: "1) Cost (tokens per dollar), 2) Capability (quality for your task), 3) Latency (response speed), 4) Privacy/compliance (can your data leave your region?)." },
    ],
  },
  {
    slug: "10-chat-models-realtime",
    sectionId: "langchain",
    title: "Chat Models — Real-time Streaming",
    order: 10,
    excerpt: "Token-by-token responses with .stream() — perceived latency drops dramatically.",
    theory: "<p>The standard <code>.invoke()</code> method waits for the complete response before returning anything — on a long answer, this means 5-10 seconds of silence before anything appears in the UI. For a chatbot, that's terrible UX.</p><p><strong>Streaming</strong> solves this: the model sends tokens as they're generated, and you display them in real-time. The user sees words appearing word-by-word, exactly like ChatGPT's interface. This uses the <code>.stream()</code> method:</p><pre><code>for chunk in model.stream(messages):\\n    print(chunk.content, end='', flush=True)</code></pre><p>Each <code>chunk</code> is an <code>AIMessageChunk</code> with a small piece of text. The loop processes and displays each piece as it arrives. <code>end=''</code> prevents newlines between chunks; <code>flush=True</code> forces immediate terminal output.</p><p>Streaming does not change the total time to complete — it only reduces <em>perceived latency</em>. Users perceive streaming responses as faster because they start seeing output immediately rather than waiting.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is the difference between .invoke() and .stream() in LangChain?",
        "How does streaming improve user experience without reducing actual computation time?",
        "What is an AIMessageChunk?",
      ],
      seniorTip: "In web applications, streaming requires Server-Sent Events (SSE) or WebSockets — you can't stream over a standard HTTP request-response cycle. LangChain's streaming is designed to work with FastAPI's <code>StreamingResponse</code> or Next.js Route Handlers with <code>ReadableStream</code>. The pattern: backend streams chunks via SSE, frontend's JavaScript event listener appends each chunk to the DOM. This is exactly how ChatGPT and Claude.ai work."
    },
    flashCards: [
      { q: "What is the difference between model.invoke() and model.stream()?", a: "invoke() waits for the complete response before returning anything. stream() yields tokens as they're generated, enabling real-time display. stream() uses a for loop: for chunk in model.stream(messages)." },
      { q: "Does streaming reduce total response time?", a: "No — the model still takes the same time to generate the full response. Streaming reduces perceived latency by showing text immediately as it's generated, rather than making users wait for completion." },
      { q: "What is an AIMessageChunk?", a: "A small piece of the LLM's response yielded during streaming. Each chunk has a .content attribute with 1-5 tokens of text. The full response is built by concatenating all chunks." },
    ],
  },
  {
    slug: "11-chat-models-cloud-history",
    sectionId: "langchain",
    title: "Chat Models — Cloud-Persisted History",
    order: 11,
    excerpt: "Storing conversation history in Redis, DynamoDB, or Postgres for production.",
    theory: "<p>In-memory chat history (a Python list) disappears when the process restarts. For production applications — web apps, APIs, multi-user systems — you need history that persists across restarts and is retrievable by session ID.</p><p><strong>LangChain's solution:</strong> <code>ChatMessageHistory</code> implementations backed by persistent stores. The most common in production: <code>RedisChatMessageHistory</code> for fast in-memory persistence with TTL, or <code>SQLChatMessageHistory</code> for durable relational storage.</p><p>The pattern uses a <em>session_id</em> — a unique identifier per conversation (typically a UUID). Each user/session has its own isolated history. The <code>RunnableWithMessageHistory</code> wrapper automatically loads and saves history around each LLM call:</p><pre><code>from langchain_community.chat_message_histories import RedisChatMessageHistory\\n\\nhistory = RedisChatMessageHistory(session_id='user-123', url='redis://localhost:6379')</code></pre><p>This is the foundation for any multi-user chatbot or persistent AI assistant.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "Why is in-memory chat history insufficient for production applications?",
        "What is a session_id and why is it important in multi-user chat applications?",
        "What are the trade-offs between Redis and PostgreSQL for storing chat history?",
      ],
      seniorTip: "Chat history storage strategy depends on access patterns: Redis provides O(1) retrieval and automatic TTL (auto-expire old sessions to save space) but data is lost if Redis restarts without persistence. PostgreSQL provides durability and queryability (analytics on what users asked, compliance auditing) but higher latency. Production systems often use both: Redis as a hot cache for active sessions, Postgres as cold storage for historical data."
    },
    flashCards: [
      { q: "Why is in-memory chat history insufficient for production?", a: "Python list-based history is reset every time the process restarts (deploys, crashes, serverless cold starts). Users would lose their conversation history. Production needs persistent storage." },
      { q: "What is a session_id in chat history management?", a: "A unique identifier (typically UUID) for each conversation or user session. History is stored and retrieved by session_id, allowing multiple users to have isolated, independent conversation histories." },
      { q: "What is RunnableWithMessageHistory in LangChain?", a: "A wrapper that automatically loads conversation history from a store before each LLM call and saves the new messages after the call, so you don't need to manually manage history loading/saving." },
    ],
  },
  {
    slug: "12-prompt-templates",
    sectionId: "langchain",
    title: "Prompt Templates",
    order: 12,
    excerpt: "Parameterised, reusable, testable prompt construction — the clean production approach.",
    theory: "<p>Prompt Templates are LangChain's second core component. They solve a real engineering problem: hard-coded prompt strings are brittle, untestable, and hard to version.</p><p>Instead of: <code>f'Translate this text: {text}. Language: {language}'</code></p><p>You define a structured template: a <code>ChatPromptTemplate</code> with named placeholders (<code>{text}</code>, <code>{language}</code>) and a system/human message structure. Variables are filled at call time.</p><p>Two common template types:</p><ul><li><code>ChatPromptTemplate.from_messages()</code> — for chat models; defines System + Human messages as a template</li><li><code>PromptTemplate.from_template()</code> — for simple single-string prompts</li></ul><p>Templates enable composability: once defined, a template can be piped directly into a model using LCEL: <code>chain = prompt | model</code>. The template fills variables and passes formatted messages to the model automatically.</p><p>In production, templates are stored as config (YAML, JSON) and loaded at runtime — allowing prompt updates without code changes.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What problem do prompt templates solve compared to f-string prompts?",
        "How do you compose a prompt template with a model using LCEL?",
        "Why would you store prompt templates as config files rather than hardcoding them?",
      ],
      seniorTip: "Prompt templates are testable units. Because they're separate from business logic, you can write unit tests that verify the rendered prompt string is correct, fuzz-test with edge-case inputs, and do A/B testing of prompt variants in production. Hard-coded f-strings inside function calls are untestable. This distinction becomes critical at scale — prompt quality directly impacts user satisfaction, and you need a systematic way to measure and improve it."
    },
    flashCards: [
      { q: "What is a ChatPromptTemplate in LangChain?", a: "A reusable template that defines the structure of a chat prompt (SystemMessage + HumanMessage) with named placeholders. Variables are filled at call time: template.invoke({'topic': 'Python'})." },
      { q: "How do you chain a prompt template with a model in LCEL?", a: "Use the pipe operator: chain = prompt | model. Then chain.invoke({'variable': 'value'}). The prompt formats the messages, passes them to the model, which returns an AIMessage." },
      { q: "Why store prompt templates as config files in production?", a: "It enables prompt iteration without code deployments, A/B testing different prompt variants, audit trails of prompt changes, and separation of prompt engineering from software engineering responsibilities." },
    ],
  },
  {
    slug: "13-chains-overview",
    sectionId: "langchain",
    title: "Chains — Overview",
    order: 13,
    excerpt: "Composing prompts, models, and parsers into end-to-end LCEL pipelines.",
    theory: "<p>Chains are LangChain's most powerful component — the ability to compose multiple steps into a sequential pipeline. The instructor calls them his personal favourite because they're where the framework earns its name.</p><p><strong>LCEL (LangChain Expression Language)</strong> uses the pipe operator (<code>|</code>) to compose any Runnable component into a chain:</p><pre><code>chain = prompt | model | output_parser\\nresult = chain.invoke({'topic': 'Python decorators'})</code></pre><p>Each component receives the output of the previous one as input. The final output is the result of the last component in the chain.</p><p><strong>Output Parsers</strong> are commonly the last step — they transform the raw <code>AIMessage</code> into a more useful format:</p><ul><li><code>StrOutputParser</code> — extracts just the text string</li><li><code>JsonOutputParser</code> — parses the response as JSON</li><li><code>PydanticOutputParser</code> — validates and types the response</li></ul><p>Chains are <em>lazy</em> — they don't execute until <code>.invoke()</code>, <code>.stream()</code>, or <code>.batch()</code> is called. This enables building complex workflows declaratively before triggering execution.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is LCEL and what does the pipe operator (|) do?",
        "Name three output parsers and explain when you'd use each.",
        "What does it mean that LCEL chains are 'lazy'?",
      ],
      seniorTip: "LCEL chains are not just sequential — they support parallel execution via <code>RunnableParallel</code>, conditional routing via <code>RunnableBranch</code>, and fallbacks via <code>.with_fallbacks()</code>. A production chain might: classify the query type in parallel with extracting entities, route to different sub-chains based on classification, and retry with a backup model on failure. This declarative composition with built-in observability (LangSmith tracing) is what makes LCEL the right choice over manual function composition."
    },
    flashCards: [
      { q: "What is a LangChain Chain?", a: "A sequence of composable steps (prompt, model, parser, retriever, tools) connected with LCEL's pipe operator (|). Each step's output is the next step's input. Execute with .invoke(), .stream(), or .batch()." },
      { q: "What does StrOutputParser do and why is it commonly the last step in a chain?", a: "Extracts the text string from an AIMessage response (just response.content). Without it, your chain returns an AIMessage object; with it, you get a plain string that's easier to use downstream." },
      { q: "What is the key difference between a Chain and directly calling model.invoke()?", a: "A Chain composes multiple steps declaratively. model.invoke() is a single step. Chains enable reusability, streaming across all steps, parallel execution, and observability without wiring everything manually." },
    ],
  },
  {
    slug: "14-langchain-recap",
    sectionId: "langchain",
    title: "LangChain Core — Recap",
    order: 14,
    excerpt: "Everything connects through the Runnable interface — the unified architecture.",
    theory: "<p>The key insight of LangChain: everything is a Runnable. ChatPromptTemplate is a Runnable. ChatOpenAI is a Runnable. Output parsers are Runnables. Tools are Runnables.</p><p>The | operator creates a RunnableSequence. This uniform interface means any component can be swapped, chained, or composed without changing the surrounding code. It's the same abstraction pattern as Unix pipes — powerful because of its simplicity.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
  {
    slug: "15-reciprocal-rank-fusion",
    sectionId: "langchain",
    title: "Reciprocal Rank Fusion for Enhanced RAG",
    order: 15,
    excerpt: "Fusing multiple ranked retrieval lists without incompatible score normalisation.",
    theory: "<p>Reciprocal Rank Fusion (RRF) solves a specific problem in advanced RAG: when you have multiple ranked lists of retrieved chunks (from different queries or retrieval methods), how do you combine them into one definitive list without duplicates?</p><p><strong>The formula:</strong> <code>RRF_score(chunk) = Σ 1 / (K + rank_position)</code></p><p>Where:</p><ul><li><code>K = 60</code> — a constant used across the industry (empirically determined to work well)</li><li><code>rank_position</code> — the position of this chunk in one retrieval result (1st = best)</li><li>The sum is across all retrieval results that contain this chunk</li></ul><p><strong>Worked example from the lecture:</strong> Query A = 'What are Tesla's revenue streams?' and Query B = 'How does Tesla generate income?' each retrieve 5 chunks. Chunks that appear in BOTH lists (X, Y, Z) get scores from both retrievals added together — giving them a higher RRF score. Chunks only in one list (W, V, A, B) score lower.</p><p>After computing RRF scores for all unique chunks, the final leaderboard is sorted by score. Top-K from this leaderboard go to the LLM — no duplicates, de-duplicated by importance across all query variants.</p><p>RRF is used in <em>multi-query RAG</em> (multiple rephrasings of one query) and in <em>hybrid search</em> (vector results + keyword results merged via RRF).</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What problem does Reciprocal Rank Fusion solve in multi-query RAG?",
        "Why is K=60 used in the RRF formula? What would happen if K were very small?",
        "In what two contexts is RRF commonly applied in production RAG systems?",
      ],
      seniorTip: "RRF is elegant because it's rank-based, not score-based. You do not need comparable scores between different retrieval systems — vector similarity scores and BM25 keyword scores are on completely different scales. RRF only looks at rank positions, making it model-agnostic and easy to combine results from any retrieval method. K=60 prevents the top-ranked chunk from completely dominating — a chunk at rank 1 scores 1/61 ≈ 0.016, not 1.0."
    },
    flashCards: [
      { q: "What is Reciprocal Rank Fusion (RRF) used for in RAG?", a: "Merging multiple ranked lists of retrieved chunks (from different queries or retrieval methods) into a single de-duplicated ranked list, by scoring chunks based on their positions across all lists." },
      { q: "What is the RRF formula and what does K represent?", a: "RRF_score = sum of 1/(K + rank_position) where K=60 is an empirically-determined constant that prevents any single top-ranked chunk from dominating the final score." },
      { q: "Why does a chunk appearing in multiple retrieval results score higher in RRF?", a: "Because its score is the SUM of 1/(K+rank) across all lists it appears in. Appearing in 2 lists gives 2 contributions to the score, signaling stronger relevance across query variants." },
    ],
  },
  {
    slug: "16-hybrid-search",
    sectionId: "langchain",
    title: "Hybrid Search — Vector + Keyword",
    order: 16,
    excerpt: "Combining dense semantic and sparse keyword retrieval — the production RAG standard.",
    theory: "<p>Hybrid search is the de facto standard in production RAG systems — used by Microsoft Copilot (across SharePoint), and most enterprise AI search products. It combines two fundamentally different retrieval strategies:</p><ol><li><b>Vector Search</b> — semantic similarity using embeddings. Great at understanding meaning and context. Finds conceptually related content even with different words.</li><li><b>Keyword Search (BM25)</b> — exact word match. Great for specific terms, names, model numbers, technical jargon, drug names. Classic Google-style search from the early 2000s.</li></ol><p><strong>The problem with pure vector search:</strong> A user searching for 'API key authentication' might get chunks about 'user login security' — semantically similar but not exactly what they want. Vector embeddings can't always distinguish between semantically-close-but-different topics.</p><p><strong>BM25 (Best Matching 25)</strong> scores chunks based on two factors:</p><ul><li><em>Term Frequency (TF)</em>: how often does the search term appear in this chunk?</li><li><em>Inverse Document Frequency (IDF)</em>: how rare is this term across all chunks? Rare terms get higher weight.</li></ul><p>The instructor's real-world result: adding hybrid search to a pharmaceutical document RAG system (complex drug names as jargon) improved accuracy by <em>at least 70%</em>. The keyword component handles exact technical terms that embeddings blur together.</p><p>The two result lists are merged via RRF to produce the final ranked chunk list.</p>",
    example: null,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "What is the limitation of pure vector search that hybrid search addresses?",
        "Explain BM25 at a high level — what two factors does it use to score chunks?",
        "How are vector search results and keyword search results combined in hybrid search?",
      ],
      seniorTip: "The weight split between vector and BM25 is a tunable hyperparameter. For general knowledge RAG (questions about concepts), equal weights (0.5/0.5) work well. For domain-specific technical content (medical terms, legal citations, product SKUs), increase BM25 weight (e.g. 0.3/0.7). This should be tuned empirically using an evaluation set — measure precision@K and recall@K for both retrievers separately and the hybrid to confirm the hybrid outperforms either alone."
    },
    flashCards: [
      { q: "What two retrieval methods are combined in hybrid search?", a: "Vector search (semantic similarity via embeddings) and keyword search (exact term matching via BM25). Each captures different types of relevance that the other misses." },
      { q: "What does BM25 stand for and what does it measure?", a: "Best Matching 25. It scores chunks based on term frequency (how often the search term appears in this chunk) and inverse document frequency (how rare the term is across all chunks)." },
      { q: "Why can't vector search alone handle exact technical jargon well?", a: "Embeddings encode semantic meaning — similar concepts cluster together. Technical terms like specific drug names or API endpoints may be semantically similar to many things, causing imprecise retrieval. BM25 finds exact matches." },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// NODES — Advanced ML (grows over time)
// ─────────────────────────────────────────────────────────
const advancedNodes = [
  {
    slug: "advanced-placeholder",
    sectionId: "advanced",
    title: "Advanced ML — Coming Soon",
    order: 0,
    excerpt: "Neural networks, decision trees, ensemble methods. Content added as you progress.",
    theory: null,
    example: null,
    animation: null,
    tool: null,
    interviewPrep: null,
  },
];

// ─────────────────────────────────────────────────────────
// COMBINED EXPORTS
// ─────────────────────────────────────────────────────────
export const nodes = [
  ...mlNodes,
  ...ragNodes,
  ...langchainNodes,
  ...advancedNodes,
];

export function getSections() {
  return [...sections].sort((a, b) => a.order - b.order);
}

export function getNodesBySection(sectionId) {
  return nodes
    .filter((n) => n.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

export function getSection(sectionId) {
  return sections.find((s) => s.id === sectionId) ?? null;
}

export function getNode(sectionId, slug) {
  return nodes.find((n) => n.sectionId === sectionId && n.slug === slug) ?? null;
}
