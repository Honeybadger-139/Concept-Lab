export const urrlNodes = [
  {
    slug: "urrl-01-welcome",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Welcome",
    order: 1,
    excerpt:
      "Course map: unsupervised learning first, recommender systems next, reinforcement learning after that.",
    theory: `<p><strong>This track expands your ML toolkit beyond label-prediction problems.</strong> Instead of only asking "what is the target y for x?", you will also learn how to discover structure in unlabeled data, rank items for users, and optimize behavior over repeated decisions.</p>
<p><strong>The first segment</strong> focuses on clustering and anomaly detection. These methods are widely used in industry because many business datasets do not come with complete labels. Clustering helps organize data into meaningful groups, and anomaly detection helps flag rare, high-risk events for review.</p>
<p><strong>The second segment</strong> covers recommender systems, one of the highest commercial-impact ML categories. Product ranking, content discovery, and ad targeting all depend on recommendation logic.</p>
<p><strong>The third segment</strong> introduces reinforcement learning, where an agent learns through interaction and reward. This framing is useful when decisions influence future states and outcomes over time.</p>
<p><strong>Practical reading:</strong> this is not three disconnected topics. It is one progression from static pattern discovery to user-personalized ranking to sequential decision-making.</p>`,
    example: `A team may use all three ideas in one business:
- Cluster users into behavior segments.
- Recommend products inside each segment.
- Use reinforcement learning to optimize long-term notification timing.` ,
    animation: null,
    tool: null,
    interviewPrep: {
      questions: [
        "How is this track different from supervised-learning-only workflows?",
        "Why are clustering and anomaly detection often taught together?",
        "What is the conceptual jump from recommenders to reinforcement learning?",
      ],
      seniorTip:
        "Explain by problem structure: no labels -> structure discovery, user-item preferences -> ranking, sequential decisions with delayed outcomes -> policy optimization.",
    },
    flashCards: [
      { q: "What does this track add beyond supervised learning?", a: "Unsupervised structure discovery, recommendation systems, and reward-driven decision learning." },
      { q: "Why is anomaly detection commercially important?", a: "It helps detect rare high-cost failures or fraud in mostly normal data streams." },
      { q: "What is the core output of clustering?", a: "Group assignments and representative cluster structure." },
      { q: "What is the core output of reinforcement learning?", a: "A policy that chooses actions to maximize long-run reward." },
    ],
  },
  {
    slug: "urrl-02-what-is-clustering",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "What Is Clustering?",
    order: 2,
    excerpt:
      "Clustering finds structure in unlabeled data by grouping similar points together.",
    theory: `<p><strong>Clustering is unsupervised learning.</strong> You are given feature vectors x, but no target labels y. Since there is no "correct answer" per example, the objective is to uncover useful structure in the feature space.</p>
<p><strong>Main operation:</strong> partition points into groups so members inside the same group are more similar to each other than to points in other groups.</p>
<p><strong>Contrast with supervised classification:</strong> supervised models learn a boundary to reproduce known labels; clustering models produce labels on their own (cluster IDs) based on geometry and similarity.</p>
<p><strong>Business use cases:</strong> customer segmentation, article grouping, genomic pattern discovery, and astronomy object grouping. In each case, clustering makes downstream reasoning or decision-making easier.</p>
<p><strong>Failure mode:</strong> poor feature scaling can dominate distances and create misleading clusters. Feature quality and normalization are often the difference between useful and useless clustering.</p>`,
    example: `Given unlabeled customer vectors [spend, visits, categories, return_rate], clustering can produce groups such as:
- frequent low-ticket buyers
- infrequent premium buyers
- discount-driven bulk shoppers

These groups can guide marketing, support policies, and recommendation strategies.` ,
    animation: "ClusterAssignmentPlayground",
    tool: "ClusterAssignmentPlayground",
    interviewPrep: {
      questions: [
        "What does clustering optimize when labels are unavailable?",
        "How is clustering output used in production systems?",
        "Why can two teams get different valid clusters from the same dataset?",
      ],
      seniorTip:
        "Mention that cluster validity is objective-dependent. The right grouping depends on what downstream decision you plan to improve.",
    },
    flashCards: [
      { q: "What data does clustering require?", a: "Input features x without target labels y." },
      { q: "What is a cluster in plain terms?", a: "A group of examples that are similar under your chosen feature representation and distance metric." },
      { q: "Is there always a single correct number of clusters?", a: "No. The useful number of clusters often depends on downstream goals and operating constraints." },
      { q: "What preprocessing is especially important before clustering?", a: "Feature scaling and representation quality." },
    ],
  },
  {
    slug: "urrl-03-k-means-intuition",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "K-Means Intuition",
    order: 3,
    excerpt:
      "K-means alternates between assigning points to nearest centroids and moving centroids to cluster means.",
    theory: `<p><strong>K-means is an iterative refinement loop.</strong> Start with random centroid guesses. Then repeat two operations until stable.</p>
<ol>
  <li>Assign each point to its nearest centroid.</li>
  <li>Recompute each centroid as the mean of assigned points.</li>
</ol>
<p><strong>Why this works:</strong> assignment creates temporary clusters; mean update recenters each cluster representation; repeating both gradually reduces within-cluster spread.</p>
<p><strong>Convergence intuition:</strong> eventually assignments stop changing and centroid movement becomes negligible. At that point, the algorithm has reached a stable configuration for that initialization.</p>
<p><strong>Practical caution:</strong> stable does not always mean globally best. K-means can converge to local optima, which is why initialization strategy matters.</p>`,
    example: `For K=2 with 30 points:
- Round 1: random centroids produce rough groups.
- Round 2: some points switch groups after centroids move.
- Round 3+: fewer switches occur.
- Final: no assignment changes -> converged clustering.` ,
    animation: "KMeansIterationStudio",
    tool: "KMeansIterationStudio",
    interviewPrep: {
      questions: [
        "Why does K-means require repeating both assignment and update steps?",
        "What does convergence mean in K-means?",
        "Why can K-means converge to different solutions on different runs?",
      ],
      seniorTip:
        "Explain local optimum behavior clearly. K-means is deterministic after initialization, but initialization itself can steer it to different stable solutions.",
    },
    flashCards: [
      { q: "What are the two K-means loop steps?", a: "Nearest-centroid assignment and centroid mean update." },
      { q: "What is a centroid?", a: "The representative center of a cluster, usually the arithmetic mean of assigned points." },
      { q: "What indicates K-means convergence?", a: "Assignments and centroid positions stop changing materially." },
      { q: "Why rerun K-means multiple times?", a: "To reduce local optimum risk from unlucky initialization." },
    ],
  },
  {
    slug: "urrl-04-k-means-algorithm",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "K-Means Algorithm",
    order: 4,
    excerpt:
      "Formal K-means procedure with assignment equations, centroid updates, and empty-cluster handling.",
    theory: `<p><strong>Formal setup:</strong> choose K centroids mu_1 ... mu_K, then iterate assignment and update until convergence.</p>
<p><strong>Assignment step:</strong> for each example x(i), set c(i) to the index of the centroid with minimum squared Euclidean distance.</p>
<p><strong>Update step:</strong> for each cluster k, set mu_k to the average of all points with c(i)=k.</p>
<p><strong>Empty-cluster edge case:</strong> if no points are assigned to a centroid, its mean is undefined. Common fixes are reinitializing that centroid or dropping the cluster.</p>
<p><strong>Geometry assumption:</strong> K-means favors compact, roughly spherical clusters. It performs poorly on long curved shapes, strong outlier contamination, or badly scaled feature spaces.</p>
<p><strong>Operational note:</strong> even when clusters are not perfectly separated, K-means can still provide useful prototypes for decisions such as product sizing or image palette compression.</p>`,
    example: `If cluster 1 currently contains points {x1, x5, x6, x10}, then:
mu_1 = (x1 + x5 + x6 + x10) / 4.

If a centroid receives zero points in the next assignment round, you cannot compute its mean and must reinitialize or remove that cluster.` ,
    animation: "KMeansIterationStudio",
    tool: "ClusterAssignmentPlayground",
    interviewPrep: {
      questions: [
        "Why is squared distance commonly used in assignment?",
        "How do you handle empty clusters robustly?",
        "What data geometry does K-means implicitly assume?",
      ],
      seniorTip:
        "Good answers include both math and system behavior: assignment minimizes local distance, update minimizes within-cluster spread, and bad initialization can still trap the run.",
    },
    flashCards: [
      { q: "What variable stores cluster assignment in K-means notation?", a: "c(i), the index of the centroid assigned to example x(i)." },
      { q: "How is each centroid updated?", a: "As the mean of all points currently assigned to that centroid." },
      { q: "What happens if a cluster has zero points?", a: "Its centroid update is undefined; reinitialize or remove it." },
      { q: "Does K-means require labeled data?", a: "No, it is unsupervised." },
    ],
  },
  {
    slug: "urrl-05-optimization-objective",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Optimization Objective",
    order: 5,
    excerpt:
      "K-means minimizes distortion: average squared distance from each point to its assigned centroid.",
    theory: `<p><strong>K-means has an explicit objective function.</strong> The distortion cost is the average squared distance between each training point and its assigned centroid.</p>
<p><code>J = (1/m) * sum_i ||x(i) - mu_(c(i))||^2</code></p>
<p><strong>Assignment step effect:</strong> with centroids fixed, assigning each point to the nearest centroid decreases or preserves J.</p>
<p><strong>Update step effect:</strong> with assignments fixed, replacing each centroid with the mean of its assigned points decreases or preserves J.</p>
<p><strong>Convergence implication:</strong> J is non-increasing per iteration, so K-means converges to a stable local optimum.</p>
<p><strong>Debugging rule:</strong> if your measured distortion increases after a full iteration, suspect an implementation bug in assignment/update or indexing.</p>`,
    example: `Consider one cluster with points at 1 and 11 on a line.
- Centroid at 2 gives average squared distance: (1^2 + 9^2)/2 = 41.
- Centroid at 6 (the mean) gives (5^2 + 5^2)/2 = 25.

This illustrates why mean update lowers distortion.` ,
    animation: "KMeansIterationStudio",
    tool: "ElbowMethodExplorer",
    interviewPrep: {
      questions: [
        "What objective does K-means optimize?",
        "Why does each K-means step not increase distortion?",
        "How can distortion monitoring help during implementation?",
      ],
      seniorTip:
        "Connect theory to observability: log per-iteration distortion and stop when improvements are below a threshold rather than relying only on fixed iteration counts.",
    },
    flashCards: [
      { q: "What is distortion in K-means?", a: "Average squared distance from points to assigned centroids." },
      { q: "Why does nearest-centroid assignment reduce J?", a: "It picks the smallest distance option for each point under fixed centroids." },
      { q: "Why does centroid mean update reduce J?", a: "The mean minimizes summed squared distances for assigned points." },
      { q: "Does K-means guarantee global optimum?", a: "No, only convergence to a local optimum for the chosen initialization." },
    ],
  },
  {
    slug: "urrl-06-initializing-k-means",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Initializing K-Means",
    order: 6,
    excerpt:
      "Initialization quality strongly affects final clustering; multi-start runs improve robustness.",
    theory: `<p><strong>Initialization is a high-leverage decision.</strong> Different random starts can converge to different local optima with noticeably different quality.</p>
<p><strong>Common approach:</strong> initialize centroids by selecting K random training examples.</p>
<p><strong>Multi-start strategy:</strong> run K-means many times with different random seeds, compute final distortion for each run, and choose the run with lowest distortion.</p>
<p><strong>Typical ranges:</strong> dozens to hundreds of restarts are common for moderate problems; diminishing returns appear after enough seeds.</p>
<p><strong>Failure mode:</strong> poor starts can place multiple centroids in the same dense region and leave other regions underrepresented, leading to weaker final partitions.</p>`,
    example: `With K=3 on the same dataset:
- Run A starts with spread-out centroids and finds intuitive 3 clusters.
- Run B starts with 2 centroids in one region and converges to weaker partitioning.

Selecting the lower-distortion run generally produces better clustering quality.` ,
    animation: "KMeansIterationStudio",
    tool: "ElbowMethodExplorer",
    interviewPrep: {
      questions: [
        "Why can two K-means runs on the same data produce different outputs?",
        "How does multi-start K-means reduce local optimum risk?",
        "What practical tradeoff limits the number of restarts?",
      ],
      seniorTip:
        "Mention compute budget. Multi-start improves quality but costs runtime; choose restart count based on quality gain curve and latency budget.",
    },
    flashCards: [
      { q: "Why does initialization matter in K-means?", a: "Because K-means converges to local optima determined by starting centroids." },
      { q: "What is multi-start K-means?", a: "Running K-means with multiple random initializations and picking the best final distortion." },
      { q: "How are centroids commonly initialized?", a: "By selecting K random training examples as initial centroid locations." },
      { q: "When should you stop adding more random restarts?", a: "When additional restarts give negligible quality improvement relative to compute cost." },
    ],
  },
  {
    slug: "urrl-07-choosing-the-number-of-clusters",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Choosing the Number of Clusters",
    order: 7,
    excerpt:
      "Choosing K is often ambiguous; combine elbow hints with downstream business tradeoffs.",
    theory: `<p><strong>There is rarely one universally correct K.</strong> Many datasets support multiple plausible segmentations depending on how you plan to use the clusters.</p>
<p><strong>Elbow method:</strong> plot distortion versus K and look for a sharp bend where marginal gains drop. This can be a useful heuristic, but many real curves decline smoothly without a clean elbow.</p>
<p><strong>Important warning:</strong> choosing K by minimizing distortion alone is invalid because distortion almost always improves as K increases.</p>
<p><strong>Better framing:</strong> choose K by downstream objective: fit quality, operational cost, explainability, and implementation complexity.</p>
<p><strong>Example tradeoff:</strong> more cluster-based product sizes may improve fit but increase manufacturing and inventory complexity.</p>`,
    example: `For apparel sizing:
- K=3 gives S/M/L with simpler operations.
- K=5 gives XS/S/M/L/XL with better fit but higher SKU and logistics cost.

Both are mathematically valid; business constraints decide which is better.` ,
    animation: "ElbowMethodExplorer",
    tool: "ElbowMethodExplorer",
    interviewPrep: {
      questions: [
        "Why is selecting K by lowest distortion alone a bad strategy?",
        "When is elbow analysis useful and when is it weak?",
        "How do downstream constraints influence K selection?",
      ],
      seniorTip:
        "Strong answers combine model metrics with product economics: K is a design decision, not just a chart-reading exercise.",
    },
    flashCards: [
      { q: "What does the elbow method plot?", a: "Distortion (or within-cluster cost) as a function of K." },
      { q: "Why is larger K usually lower distortion?", a: "More centroids reduce average distance to nearest centroid." },
      { q: "Can two different K values both be valid?", a: "Yes, depending on downstream use and operational constraints." },
      { q: "What should guide final K choice?", a: "Downstream utility plus acceptable complexity and cost." },
    ],
  },
  {
    slug: "urrl-08-finding-unusual-events",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Finding Unusual Events",
    order: 8,
    excerpt:
      "Anomaly detection learns normal behavior and flags low-probability events for inspection.",
    theory: `<p><strong>Anomaly detection is a risk-screening workflow.</strong> Train on mostly normal behavior, then identify new points that look statistically unlikely under that normal profile.</p>
<p><strong>Typical logic:</strong> learn p(x), compute p(x_test), and flag when p(x_test) is below a small threshold epsilon.</p>
<p><strong>Why this is useful:</strong> many critical systems generate huge normal traffic and very few failures. Modeling normality is often easier than collecting exhaustive labels for every possible failure type.</p>
<p><strong>Operational pattern:</strong> flagged events are usually reviewed, not automatically acted on. The model is a triage filter to focus human or automated verification resources.</p>
<p><strong>Use cases:</strong> fraud detection, manufacturing quality control, infrastructure monitoring, and suspicious account behavior.</p>`,
    example: `Engine QA flow:
- Features: heat, vibration, pressure ratios.
- Train density model on normal engines.
- New engine arrives with rare feature profile.
- p(x_test) falls below epsilon -> send to manual inspection before shipping.` ,
    animation: "GaussianDensityAnomalyViz",
    tool: "AnomalyThresholdEvaluator",
    interviewPrep: {
      questions: [
        "Why is anomaly detection often trained on normal data only?",
        "Why is thresholding p(x) a useful triage mechanism?",
        "Why should anomaly flags often trigger review rather than direct blocking?",
      ],
      seniorTip:
        "Always mention false-positive cost. In production, anomaly systems are judged by review workload and missed-risk balance, not just offline score.",
    },
    flashCards: [
      { q: "What event is flagged as anomalous?", a: "An example with probability p(x) below threshold epsilon." },
      { q: "What does anomaly detection model first?", a: "Normal behavior distribution." },
      { q: "Is anomaly detection always fully automated actioning?", a: "No. It is often a prioritization/triage signal for further checks." },
      { q: "Name one anomaly detection industry use case.", a: "Fraud screening, quality inspection, or data-center fault monitoring." },
    ],
  },
  {
    slug: "urrl-09-gaussian-normal-distribution",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Gaussian (Normal) Distribution",
    order: 9,
    excerpt:
      "Gaussian distributions model feature likelihood via mean and variance, forming the basis of simple anomaly scoring.",
    theory: `<p><strong>Gaussian and normal distribution refer to the same bell-shaped model.</strong> It is parameterized by mean mu (center) and variance sigma^2 (spread).</p>
<p><strong>Interpretation:</strong> values near mu are more likely; values far from mu are less likely. Narrow sigma creates a tall narrow bell; large sigma creates a wider flatter bell.</p>
<p><strong>Parameter estimation from data:</strong> mu is sample average, sigma^2 is average squared deviation from mu.</p>
<p><strong>Why this matters for anomaly detection:</strong> once each feature has a density estimate, low-density values provide a quantitative signal for unusual behavior.</p>
<p><strong>Practical caveat:</strong> Gaussian fit quality depends on feature shape. Highly skewed features may need transforms before this model is reliable.</p>`,
    example: `Suppose feature x = vibration amplitude.
- Estimated mu = 3.0
- Estimated sigma = 0.8

A reading x=3.1 has high p(x), likely normal.
A reading x=6.0 has very low p(x), likely unusual and worth investigation.` ,
    animation: "GaussianDensityAnomalyViz",
    tool: "GaussianDensityAnomalyViz",
    interviewPrep: {
      questions: [
        "What do mu and sigma control in a Gaussian?",
        "How are mu and sigma estimated from training data?",
        "Why can Gaussian modeling fail on skewed raw features?",
      ],
      seniorTip:
        "Tie theory to engineering: distributional assumptions are only as good as feature design. Histogram checks are cheap and high leverage.",
    },
    flashCards: [
      { q: "What parameter sets Gaussian center?", a: "mu (mean)." },
      { q: "What parameter controls Gaussian spread?", a: "sigma (standard deviation), with variance sigma^2." },
      { q: "How is mu estimated from samples?", a: "As the arithmetic mean of observed feature values." },
      { q: "Why does bell width matter in anomaly scoring?", a: "It determines how quickly probability decays away from typical values." },
    ],
  },
  {
    slug: "urrl-10-anomaly-detection-algorithm",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Anomaly Detection Algorithm",
    order: 10,
    excerpt:
      "Fit one Gaussian per feature, multiply densities into p(x), then classify with epsilon threshold.",
    theory: `<p><strong>Algorithm structure:</strong> for each feature x_j, estimate mu_j and sigma_j^2 from training data, then compute per-feature Gaussian probabilities and multiply them into p(x).</p>
<p><code>p(x) = product_j p(x_j; mu_j, sigma_j^2)</code></p>
<p><strong>Decision rule:</strong> if p(x) &lt; epsilon, mark as anomaly; otherwise treat as normal.</p>
<p><strong>Core intuition:</strong> one strongly unusual feature can push the product probability down sharply, making the whole example stand out.</p>
<p><strong>Assumption:</strong> this factorization corresponds to conditional independence approximation. Even when that assumption is imperfect, the approach can still be practical with good features.</p>
<p><strong>Failure mode:</strong> correlated features and poor feature engineering can make p(x) poorly calibrated, causing both misses and noisy alerts.</p>`,
    example: `Engine monitoring with features [heat, vibration]:
- Fit Gaussian for heat and another for vibration.
- New engine has moderate heat but extreme vibration.
- p(vibration) is very low, so p(x) becomes small.
- If p(x) < epsilon, flag for quality inspection.` ,
    animation: "GaussianDensityAnomalyViz",
    tool: "GaussianDensityAnomalyViz",
    interviewPrep: {
      questions: [
        "Why does multiplying per-feature probabilities help anomaly scoring?",
        "What is the role of epsilon in the classifier?",
        "How do correlated features affect this simple model?",
      ],
      seniorTip:
        "Discuss this as a baseline detector: simple, fast, explainable. Then mention that feature quality and threshold policy usually matter more than mathematical sophistication.",
    },
    flashCards: [
      { q: "How is p(x) computed in the basic anomaly algorithm?", a: "As a product of per-feature Gaussian probabilities." },
      { q: "What triggers an anomaly label?", a: "p(x) below epsilon." },
      { q: "What does epsilon control operationally?", a: "Alert sensitivity versus false-alarm burden." },
      { q: "Can this method work without many labeled anomalies?", a: "Yes. It is mostly trained from normal data." },
    ],
  },
  {
    slug: "urrl-11-developing-and-evaluating-an-anomaly-detection-system",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Developing and Evaluating an Anomaly Detection System",
    order: 11,
    excerpt:
      "Use cross-validation anomalies to tune epsilon and features; evaluate with skew-aware metrics like precision, recall, and F1.",
    theory: `<p><strong>Real-number evaluation is essential.</strong> You need measurable feedback while tuning features and epsilon, otherwise detector improvements become guesswork.</p>
<p><strong>Practical split pattern:</strong> train on many normal examples; use a validation set with a small number of known anomalies; keep a separate test set when anomaly count allows.</p>
<p><strong>Prediction protocol:</strong> compute p(x) on validation/test examples, apply threshold rule, then compare predictions to labels.</p>
<p><strong>Metric warning:</strong> heavy class imbalance makes raw accuracy misleading. Use precision, recall, F1, and confusion breakdown to understand tradeoffs.</p>
<p><strong>Small-data caveat:</strong> when anomalies are extremely few, teams may tune on a single validation set without a separate test set. This increases overfitting risk and should be acknowledged in reporting.</p>`,
    example: `Dataset:
- 10,000 normal engines
- 20 known anomalous engines

Workflow:
- Train model on 6,000 normal.
- Validate on 2,000 normal + 10 anomalies to tune epsilon/features.
- Test on 2,000 normal + 10 anomalies for final estimate.

Primary checks:
- anomaly recall (miss rate)
- false alert burden on normal units` ,
    animation: "AnomalyThresholdEvaluator",
    tool: "AnomalyThresholdEvaluator",
    interviewPrep: {
      questions: [
        "Why is accuracy often a weak metric for anomaly detection?",
        "How do you split data when anomalies are very scarce?",
        "What is the consequence of tuning epsilon without a held-out test set?",
      ],
      seniorTip:
        "Frame evaluation as risk management: missed anomalies and false alarms have asymmetric operational costs, so metric choice must reflect business impact.",
    },
    flashCards: [
      { q: "Why can high accuracy still mean a poor anomaly detector?", a: "Because the model may predict normal for almost everything in an imbalanced dataset." },
      { q: "Which metrics are commonly used for anomaly detector tuning?", a: "Precision, recall, F1, plus confusion matrix counts." },
      { q: "What does epsilon tuning primarily control?", a: "Tradeoff between anomaly catch rate and false positives." },
      { q: "What increases when there is no separate test set?", a: "Risk of overfitting validation decisions." },
    ],
  },
  {
    slug: "urrl-12-anomaly-detection-vs-supervised-learning",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Anomaly Detection vs Supervised Learning",
    order: 12,
    excerpt:
      "Pick anomaly detection for rare and evolving positives; pick supervised learning when positives are sufficiently labeled and stable.",
    theory: `<p><strong>This choice depends on future positive-case behavior, not only class imbalance.</strong></p>
<p><strong>Use anomaly detection when:</strong> positives are rare, diverse, and likely to include new patterns not represented in current labels.</p>
<p><strong>Use supervised learning when:</strong> you have enough labeled positives/negatives and future positives resemble historical positives.</p>
<p><strong>Fraud vs spam contrast:</strong> fraud patterns evolve quickly, making novelty detection valuable; spam patterns are more repetitive, making supervised classification effective.</p>
<p><strong>Manufacturing contrast:</strong> known recurring defects can be supervised; unknown future defect types are better handled by anomaly detection.</p>
<p><strong>Decision rule:</strong> ask whether your positive class is stable and well-covered. If not, anomaly detection is often the safer baseline.</p>`,
    example: `If a bank sees constantly changing fraud tactics, a supervised model trained on last quarter's fraud labels may miss new attack modes.

Anomaly detection that models normal transaction behavior can still flag novel suspicious patterns for investigation.` ,
    animation: "AnomalyThresholdEvaluator",
    tool: "AnomalyThresholdEvaluator",
    interviewPrep: {
      questions: [
        "Why is novelty expectation central to method selection?",
        "Why can supervised learning still fail even with class weights on fraud tasks?",
        "Give an example where anomaly detection and supervised learning both coexist.",
      ],
      seniorTip:
        "Mention hybrid patterns: anomaly detector for candidate generation, supervised model for confirmation/ranking. Many real systems combine both.",
    },
    flashCards: [
      { q: "When is anomaly detection usually preferred?", a: "When positive examples are rare and future positives may be novel." },
      { q: "When is supervised learning usually preferred?", a: "When labeled positives are sufficient and future positives are similar to past examples." },
      { q: "Why is fraud often an anomaly problem?", a: "Attack patterns evolve and are not fully represented by historical labels." },
      { q: "Can anomaly detection and supervised learning be combined?", a: "Yes, commonly in multi-stage risk pipelines." },
    ],
  },
  {
    slug: "urrl-13-choosing-what-features-to-use",
    sectionId: "ml",
    conceptId: "unsupervised-recommenders-reinforcement-learning",
    title: "Choosing What Features to Use",
    order: 13,
    excerpt:
      "Feature shaping and engineering are critical in anomaly detection; transform skewed variables and iterate via error analysis.",
    theory: `<p><strong>Feature engineering is especially important for anomaly detection.</strong> With limited supervised signal, the model relies heavily on feature distributions and cannot easily learn to ignore bad signals.</p>
<p><strong>Gaussian-fit support:</strong> inspect histograms and transform skewed features using log, log(x+c), square root, or fractional powers to better match bell-shape assumptions.</p>
<p><strong>Consistency rule:</strong> apply identical transformations to training, validation, and test data.</p>
<p><strong>Error-analysis loop:</strong> inspect missed anomalies, identify what was unique, design a feature that captures that signal, retrain, and re-evaluate.</p>
<p><strong>Feature interaction example:</strong> individual CPU load and network traffic may look normal, but their ratio can reveal abnormal machine behavior.</p>
<p><strong>Failure mode:</strong> piling on many ad hoc features can overfit validation anomalies. Keep feature additions hypothesis-driven and operationally interpretable.</p>`,
    example: `Data-center anomaly case:
- Raw features: CPU load, network traffic, memory, disk I/O.
- Missed anomaly: high CPU with unusually low traffic.
- New engineered feature: CPU_load / network_traffic.
- Retrain and evaluate: this pattern now receives lower p(x) and is detected.` ,
    animation: "GaussianDensityAnomalyViz",
    tool: "AnomalyThresholdEvaluator",
    interviewPrep: {
      questions: [
        "Why does feature quality matter more in anomaly detection than in many supervised tasks?",
        "How do log or power transforms improve Gaussian-based anomaly models?",
        "How would you use missed anomalies to design new features?",
      ],
      seniorTip:
        "Give a concrete feature-engineering narrative from error analysis. Senior answers are specific about the signal that was missing and how the new feature exposes it.",
    },
    flashCards: [
      { q: "Why transform skewed features in Gaussian anomaly detection?", a: "To better align feature distributions with model assumptions and improve density estimation quality." },
      { q: "What is a common safe log transform variant?", a: "log(x + c) with small c when zeros are possible." },
      { q: "What is the role of error analysis in anomaly feature engineering?", a: "It identifies missed-pattern signatures and guides targeted new features." },
      { q: "Why can ratio features be useful in anomaly detection?", a: "They capture interaction patterns that raw features alone may hide." },
    ],
  },
];
