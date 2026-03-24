const CHEAT_SHEET_URL = "/cheatsheets/docker-cheat-sheet.pdf";

function makeNode(node) {
  return {
    sectionId: "docker",
    ...node,
  };
}

function buildInterviewPrep(questions, answers, seniorTip) {
  return { questions, answers, seniorTip };
}

function buildFlashCards(cards) {
  return cards.map(([q, a]) => ({ q, a }));
}

export const dockerNodes = [
  makeNode({
    slug: "01-introduction-to-docker",
    order: 1,
    title: "Introduction to Docker",
    excerpt:
      "Timestamp 00:01:40. Foundations: what Docker is, why it became essential, and how it fixes environment drift in teams.",
    theory: `<p><strong>Transcript anchor (00:01:40):</strong> the lecture starts with a realistic team problem: code is same, environment is not. One machine uses Node 16 + MongoDB 4.2, another machine uses newer versions, and behavior diverges.</p>
<p><strong>Docker's core contribution is runtime standardization.</strong> Instead of sharing instructions and hoping each machine reproduces them correctly, we package runtime assumptions into image artifacts and run containers from those artifacts.</p>
<h3>Architecture Diagram</h3>
<pre><code>Without Docker:
source code -> manual setup per machine -> dependency drift -> inconsistent behavior

With Docker:
source code + Dockerfile -> image artifact -> container runtime (dev/CI/prod parity)</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Reproducibility:</strong> application behavior follows image contract, not host assumptions.</li>
  <li><strong>Portability:</strong> same image can be promoted across environments with fewer surprises.</li>
  <li><strong>Operational clarity:</strong> debugging shifts from tribal setup knowledge to explicit runtime metadata.</li>
</ul>
<h3>Transcript Coverage in This Segment</h3>
<ul>
  <li>The lecture starts from a team drift scenario and motivates Docker with real environment mismatch pain.</li>
  <li>It introduces <strong>container</strong> as the runnable packaged runtime and <strong>image</strong> as the blueprint artifact behind that runtime.</li>
  <li>It also highlights a core practical benefit: different projects can run different dependency versions on the same host via isolated containers.</li>
</ul>
<h3>Data Science Project Angle</h3>
<p>In data projects, environment drift is costly: Python libs, system dependencies, and model runtime versions can silently break reproducibility. Docker gives a stable execution baseline for experimentation, validation, and serving.</p>`,
    example:
      "A churn-prediction API that works locally can be packaged once and then run consistently on teammate laptops, CI runners, and production hosts.",
    animation: "DockerArchitectureViz",
    tool: "DockerCourseTimelineStudio",
    interviewPrep: buildInterviewPrep(
      [
        "What specific engineering problem does Docker solve in multi-developer teams?",
        "Why does Docker matter more in ML/data systems than in simple scripts?",
        "How would you explain 'works on my machine' to a product manager?",
      ],
      [
        "Docker turns runtime setup into a versioned artifact, reducing dependency mismatch across developers, CI, and deployment environments.",
        "ML systems are highly dependency-sensitive (frameworks, drivers, serving stack), so runtime drift causes reproducibility and deployment failures.",
        "Code can be correct while environment assumptions differ. Docker makes those assumptions explicit and portable.",
      ],
      "Top-tier answers connect Docker to reduced incident rate, faster onboarding, and predictable release behavior."
    ),
    flashCards: buildFlashCards([
      ["What is Docker's central value?", "Reproducible runtime environments packaged as portable image artifacts."],
      ["What causes 'works on my machine'?", "Environment drift across machines despite shared code."],
      ["What is promoted in a Docker workflow?", "Versioned image artifacts, not ad-hoc machine setups."],
      ["Why is Docker important in MLOps?", "Model/runtime compatibility depends on strict environment consistency."],
    ]),
  }),
  makeNode({
    slug: "02-docker-installation",
    order: 2,
    title: "Docker Installation",
    excerpt:
      "Timestamp 00:14:50. Install and verify Docker correctly so the CLI-daemon pipeline is stable before development begins.",
    theory: `<p><strong>Transcript anchor (00:14:50):</strong> installation is not just downloading Docker Desktop. The real goal is a healthy CLI-to-daemon execution path.</p>
<p><strong>Docker execution model:</strong> CLI issues commands, daemon executes build/run/network/storage operations. If daemon permissions or virtualization support are broken, all workflows fail later.</p>
<h3>Architecture Diagram</h3>
<pre><code>Terminal command (docker ...)
    -> Docker CLI
    -> Docker Daemon (Engine)
    -> Image pull/build
    -> Container run + logs + networking</code></pre>
<h3>Verification Sequence</h3>
<pre><code>docker --version
docker version
docker info
docker run hello-world</code></pre>
<ul>
  <li><strong>Failure domain 1:</strong> daemon not running.</li>
  <li><strong>Failure domain 2:</strong> user permission/socket access issues.</li>
  <li><strong>Failure domain 3:</strong> virtualization backend not correctly configured.</li>
</ul>
<p><strong>Team best practice:</strong> maintain a baseline install checklist per OS so onboarding is deterministic.</p>`,
    example:
      "Two engineers can both have Docker installed, but only one has daemon permissions configured correctly. A readiness checklist catches this before project work begins.",
    animation: "DockerInstallReadinessLab",
    tool: "DockerInstallReadinessLab",
    interviewPrep: buildInterviewPrep(
      [
        "Why is `docker --version` not enough to validate Docker setup?",
        "What does `docker run hello-world` prove end-to-end?",
        "What should teams standardize for installation quality?",
      ],
      [
        "CLI version does not guarantee daemon health, permissions, or host virtualization readiness.",
        "It verifies command dispatch, daemon availability, image retrieval, container startup, and runtime output path.",
        "OS-specific prerequisites, daemon checks, permission setup, and expected verification output.",
      ],
      "Strong responses treat installation as a reliability gate, not a one-time local action."
    ),
    flashCards: buildFlashCards([
      ["What are core install layers?", "CLI, daemon/engine, and host virtualization/permissions."],
      ["Which command gives daemon-level details?", "`docker info`"],
      ["What does hello-world validate?", "End-to-end Docker runtime health."],
      ["Why maintain install baseline docs?", "To reduce repeated onboarding failures and hidden local drift."],
    ]),
  }),
  makeNode({
    slug: "03-docker-commands",
    order: 3,
    title: "Docker Commands",
    excerpt:
      "Timestamp 00:21:00. Operational command fluency for image lifecycle, container lifecycle, and runtime diagnostics.",
    theory: `<p><strong>Transcript anchor (00:21:00):</strong> command literacy is the practical backbone of Docker usage.</p>
<p><strong>Theory lens:</strong> commands map to object types. Most confusion disappears when you first decide whether you are operating on images, containers, volumes, or networks.</p>
<h3>Command Groups</h3>
<ul>
  <li><strong>Image lifecycle:</strong> pull, build, images, tag, push, rmi.</li>
  <li><strong>Container lifecycle:</strong> run, ps, stop, start, rm.</li>
  <li><strong>Diagnostics:</strong> logs, exec, inspect, stats.</li>
</ul>
<pre><code>docker build -t fraud-api:1.0 .
docker run -d --name fraud-api -p 8000:8000 fraud-api:1.0
docker ps
docker logs fraud-api
docker exec -it fraud-api sh</code></pre>
<h3>Architecture Diagram</h3>
<pre><code>Build path: Dockerfile -> docker build -> image
Run path: image -> docker run -> container
Debug path: container -> logs/inspect/exec -> root cause</code></pre>
<p><strong>Operational principle:</strong> tag strategy is part of command strategy. Commands without version discipline create release ambiguity.</p>`,
    example:
      "Interaction example: a recommendation API incident can be resolved with a deterministic sequence - `docker ps` to confirm state, `docker logs` for failure clue, `docker inspect` for config mismatch, and `docker exec` for in-container verification.",
    animation: "DockerCommandWorkbench",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "What command sequence do you use during first-minute production triage?",
        "How do `run` and `exec` differ conceptually?",
        "Why is tagging strategy inseparable from command usage?",
      ],
      [
        "Start with `docker ps`, then `docker logs`, then `docker inspect` and `docker exec` for deep checks.",
        "`run` creates/starts a new container from an image; `exec` runs commands in an existing container.",
        "Without stable tags, command-driven deployments are not traceable or rollback-safe.",
      ],
      "Senior answers include command names plus decision logic and release-risk implications."
    ),
    flashCards: buildFlashCards([
      ["Which command builds from Dockerfile?", "`docker build`"],
      ["Which command lists running containers?", "`docker ps`"],
      ["Which command inspects live container internals?", "`docker exec -it <container> sh`"],
      ["Why avoid depending only on `latest`?", "It breaks reproducibility and rollback confidence."],
    ]),
  }),
  makeNode({
    slug: "04-docker-image-layers",
    order: 4,
    title: "Docker Image Layers",
    excerpt:
      "Timestamp 00:34:13. Layering mechanics, cache invalidation behavior, and performance implications for build pipelines.",
    theory: `<p><strong>Transcript anchor (00:34:13):</strong> image layering explains why some builds take seconds and others take minutes for tiny code changes.</p>
<p><strong>Each Dockerfile instruction forms a layer.</strong> Docker reuses unchanged layers. If an early instruction changes, downstream layers rebuild.</p>
<h3>Architecture Diagram</h3>
<pre><code>FROM base
  -> layer 1 (stable)
COPY requirements.txt
  -> layer 2 (changes occasionally)
RUN pip install
  -> layer 3 (expensive)
COPY source
  -> layer 4 (changes frequently)</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Cache-aware ordering:</strong> place stable expensive steps before volatile code copy steps.</li>
  <li><strong>CI throughput:</strong> optimized layering reduces build duration for every pull request.</li>
  <li><strong>Release reliability:</strong> deterministic layering reduces build surprises across environments.</li>
</ul>
<p><strong>Advanced extension:</strong> multi-stage builds separate build tooling from final runtime, improving size and security profile.</p>`,
    example:
      "A model-serving API with unchanged dependencies should not reinstall its entire Python stack every code edit if layers are ordered properly.",
    animation: "DockerLayerCacheLab",
    tool: "DockerLayerCacheLab",
    interviewPrep: buildInterviewPrep(
      [
        "What is cache invalidation in Docker build context?",
        "Why does Dockerfile instruction order influence CI cost?",
        "How do you optimize image builds for fast iteration?",
      ],
      [
        "If an instruction changes, Docker rebuilds that layer and all layers after it.",
        "Poor ordering causes unnecessary expensive layer rebuilds, multiplying compute cost and slowing delivery.",
        "Keep stable dependency layers early, volatile source layers late, and minimize build context noise.",
      ],
      "Senior framing ties layering to throughput economics and release predictability, not just local speed."
    ),
    flashCards: buildFlashCards([
      ["What creates image layers?", "Dockerfile instructions."],
      ["What happens if an early layer changes?", "That layer and all downstream layers are rebuilt."],
      ["Where should dependency install usually go?", "Before copying frequently changing source files."],
      ["Why do layer strategies matter in teams?", "They directly impact CI speed and developer feedback loops."],
    ]),
  }),
  makeNode({
    slug: "05-port-binding",
    order: 5,
    title: "Port Binding",
    excerpt:
      "Timestamp 00:37:08. Host-to-container port mapping, listener behavior, and reliable service exposure.",
    theory: `<p><strong>Transcript anchor (00:37:08):</strong> many Docker issues are not crashes, but reachability failures caused by wrong port mapping or listener configuration.</p>
<p><strong>Port binding maps external host traffic to internal container service ports.</strong></p>
<pre><code>docker run -d --name scoring-api -p 8000:8000 scoring-api:1.0</code></pre>
<h3>Architecture Diagram</h3>
<pre><code>Client (browser/curl) -> host:8000
    Docker port mapping (8000:8000)
        -> container process listening on 0.0.0.0:8000</code></pre>
<h3>Failure Modes</h3>
<ul>
  <li>Published host port does not match container listener port.</li>
  <li>Application listens on localhost only inside container.</li>
  <li>Container appears running but app crashed before opening socket.</li>
</ul>
<p><strong>Data-serving implication:</strong> model APIs often fail silently at networking layer before inference logic is ever reached.</p>`,
    example:
      "A Jupyter container can run successfully but remain inaccessible until the right host-to-container port and bind address are configured.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Container is running but API endpoint is unreachable. First checks?",
        "Why does `0.0.0.0` matter for containerized apps?",
        "What is the easiest way to explain host:container mapping?",
      ],
      [
        "Check `docker ps` port mapping, app listener port, and logs for startup failures.",
        "Binding to loopback inside container may block host-forwarded traffic; `0.0.0.0` exposes listener correctly.",
        "Host port is external entry point; container port is internal service listener.",
      ],
      "Best answers distinguish process health from network reachability."
    ),
    flashCards: buildFlashCards([
      ["What does `-p 8000:8000` do?", "Maps host port 8000 to container port 8000."],
      ["Can a container run but be unreachable?", "Yes, if listener/mapping is incorrect."],
      ["Which command quickly shows published ports?", "`docker ps`"],
      ["Why verify bind address?", "Wrong bind interface can block external traffic."],
    ]),
  }),
  makeNode({
    slug: "06-troubleshoot-commands-and-logs",
    order: 6,
    title: "Troubleshoot Commands and Logs",
    excerpt:
      "Timestamp 00:42:45. Structured troubleshooting workflow using logs, inspect, exec, and dependency validation.",
    theory: `<p><strong>Transcript anchor (00:42:45):</strong> troubleshooting requires sequence and failure-domain thinking.</p>
<pre><code>docker ps -a
docker logs -f service
docker inspect service
docker exec -it service sh
docker stats</code></pre>
<h3>Architecture Diagram</h3>
<pre><code>1) Runtime state: Is container alive?
2) App state: What do logs report?
3) Config state: Are env vars/ports/mounts correct?
4) Dependency state: Can container reach DB/cache/external APIs?
5) Resource state: CPU/memory pressure?</code></pre>
<h3>Interaction Scenarios</h3>
<ul>
  <li><strong>Crash-loop on startup:</strong> bad command/env/runtime mismatch.</li>
  <li><strong>Healthy container, failing requests:</strong> dependency path broken.</li>
  <li><strong>Intermittent latency:</strong> resource pressure or downstream timeout.</li>
</ul>
<p><strong>Theory principle:</strong> logs explain behavior, inspect explains configuration, exec confirms real in-container state.</p>`,
    example:
      "A model API may pass container health checks but fail predictions if the model path env var is missing. `docker inspect` plus `docker exec` reveals this immediately.",
    animation: "DockerCommandWorkbench",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "How do you isolate app failure from infrastructure failure in Docker incidents?",
        "When do you prefer `inspect` over `logs`?",
        "What is your standard debugging checklist for containerized APIs?",
      ],
      [
        "Start with container/process state, then app logs, then dependency connectivity and runtime metadata.",
        "`inspect` for structural metadata; `logs` for runtime behavior.",
        "State -> logs -> config -> dependency -> resources, in that order.",
      ],
      "High-signal answers emphasize deterministic triage flow and quick failure-domain isolation."
    ),
    flashCards: buildFlashCards([
      ["First command for broad container visibility?", "`docker ps -a`"],
      ["Best command for runtime events?", "`docker logs -f <container>`"],
      ["What does `docker inspect` reveal?", "Ports, env vars, mounts, network metadata, and runtime config."],
      ["Why use `docker exec` while debugging?", "To verify actual in-container files, env, and process state."],
    ]),
  }),
  makeNode({
    slug: "07-docker-vs-virtual-machine",
    order: 7,
    title: "Docker vs Virtual Machine",
    excerpt:
      "Timestamp 00:45:30. Architectural comparison: isolation model, overhead profile, startup behavior, and deployment fit.",
    theory: `<p><strong>Transcript anchor (00:45:30):</strong> Docker and VMs solve different isolation problems. Containers are not a universal VM replacement.</p>
<h3>Architecture Diagram</h3>
<pre><code>VM stack:
app + libs + guest OS + hypervisor

Container stack:
app + libs + shared host kernel primitives</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Containers:</strong> fast startup, high density, portable app packaging.</li>
  <li><strong>VMs:</strong> stronger OS/kernel isolation boundaries, legacy compatibility.</li>
  <li><strong>Design decision:</strong> choose by workload and compliance constraints, not hype.</li>
</ul>
<p><strong>Data platform fit:</strong> model APIs, ETL workers, and feature services commonly run in containers; legacy vendor dependencies may still require VM boundaries.</p>`,
    example:
      "A modern recommender service can run in containers, while a legacy analytics package tied to a specific OS kernel may remain VM-hosted.",
    animation: "DockerArchitectureViz",
    tool: "DockerArchitectureViz",
    interviewPrep: buildInterviewPrep(
      [
        "Why are containers lighter than VMs?",
        "When is VM still the right answer?",
        "What is the most practical container-vs-VM tradeoff?",
      ],
      [
        "Containers share the host kernel and avoid full guest OS duplication.",
        "When strong OS isolation, kernel control, or legacy OS dependencies are required.",
        "Delivery speed/resource efficiency versus isolation depth/compliance boundaries.",
      ],
      "Strong answers avoid absolutism and show workload-aware tradeoff thinking."
    ),
    flashCards: buildFlashCards([
      ["Main architectural difference?", "VMs package guest OS; containers share host kernel."],
      ["Why do containers start faster?", "No full guest OS boot."],
      ["When prefer VM?", "When stronger OS-level isolation or legacy requirements demand it."],
      ["Can both coexist?", "Yes, hybrid runtime architectures are common."],
    ]),
  }),
  makeNode({
    slug: "08-developing-with-docker",
    order: 8,
    title: "Developing with Docker",
    excerpt:
      "Timestamp 00:48:43. Practical local development loops with containers, mounts, env config, and service parity.",
    theory: `<p><strong>Transcript anchor (00:48:43):</strong> Docker is a daily development workflow tool, not only a deployment tool.</p>
<p><strong>Goal:</strong> make local dev environment reproducible while preserving fast edit-run-debug cycles.</p>
<h3>Architecture Diagram</h3>
<pre><code>Host source code (bind mount)
    -> container runtime process
    -> local dependencies (DB/cache) in companion containers
    -> same runtime contract as CI/prod baseline</code></pre>
<h3>Development Pattern</h3>
<ul>
  <li>Use bind mounts for iterative code updates.</li>
  <li>Externalize configuration with env vars.</li>
  <li>Keep base image + dependencies pinned for teammate parity.</li>
</ul>
<p><strong>Theory caution:</strong> development convenience (host mounts, debug tooling) should not leak unchanged into production images.</p>`,
    example:
      "Interaction example: run Jupyter + feature-engineering scripts with bind mounts for instant edits, while Postgres/Redis run as companion containers so all teammates develop against the same runtime contract.",
    animation: "DockerMlOpsPipelineStudio",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "How do you keep Docker-based development fast, not cumbersome?",
        "Why separate development-time and production-time concerns?",
        "How does Docker improve collaboration in active feature development?",
      ],
      [
        "Use cache-aware builds, bind mounts for source, and minimal rebuilds for rapid loops.",
        "Dev tooling and host assumptions can degrade production security/reliability if copied directly.",
        "Everyone works against a standardized runtime baseline, reducing local environment surprises.",
      ],
      "Great answers emphasize balancing developer velocity with deployment discipline."
    ),
    flashCards: buildFlashCards([
      ["Why use bind mounts during development?", "Instant reflection of code edits inside container runtime."],
      ["What should stay environment-specific?", "Runtime configuration via env vars, not image hardcoding."],
      ["What improves team collaboration?", "Shared containerized dev baseline across contributors."],
      ["Why avoid direct dev->prod parity of all settings?", "Dev convenience settings can be unsafe or brittle in production."],
    ]),
  }),
  makeNode({
    slug: "09-docker-compose",
    order: 9,
    title: "Docker Compose",
    excerpt:
      "Timestamp 01:07:17. Declarative orchestration for multi-container application stacks and dependency coordination.",
    theory: `<p><strong>Transcript anchor (01:07:17):</strong> real systems are multi-service. Compose captures service topology in a single versioned spec.</p>
<pre><code>services:
  api:
    build: .
    ports: ["8000:8000"]
    depends_on: [postgres, redis, mlflow]
  postgres:
    image: postgres:16
  redis:
    image: redis:7
  mlflow:
    image: ghcr.io/mlflow/mlflow:v2.14.1
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:</code></pre>
<h3>Architecture Diagram</h3>
<pre><code>Compose file
    -> api service
    -> database service
    -> shared network + shared volume contracts
    -> one-command startup for local integration testing</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Declarative topology:</strong> service dependencies become reviewable infrastructure code.</li>
  <li><strong>Service discovery:</strong> containers communicate using service names.</li>
  <li><strong>Parity testing:</strong> validate interactions before orchestrator-level deployment.</li>
</ul>`,
    example:
      "Interaction example: a forecasting platform can run API, Postgres, Redis, and MLflow in one Compose stack so the full training-to-serving loop is validated locally before promotion.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Why is Compose better than many independent `docker run` commands?",
        "How do services talk to each other in Compose by default?",
        "Where does Compose fit in production-oriented workflows?",
      ],
      [
        "It centralizes multi-service runtime contract into version-controlled configuration.",
        "Through shared Compose networking, often using service names as hostnames.",
        "It is ideal for local/staging integration validation before higher-level orchestration deployment.",
      ],
      "Strong responses describe Compose as collaboration infrastructure, not just shortcut syntax."
    ),
    flashCards: buildFlashCards([
      ["What is Compose?", "Declarative multi-container orchestration using a single config file."],
      ["How to start stack?", "`docker compose up`"],
      ["How do services discover each other?", "By service names over shared network."],
      ["Why does Compose matter in teams?", "Topology and config are explicit, shared, and reviewable."],
    ]),
  }),
  makeNode({
    slug: "10-dockerizing-our-application",
    order: 10,
    title: "Dockerizing Our Application",
    excerpt:
      "Timestamp 01:20:53. Convert your own app into a robust image with deterministic dependencies and production-ready runtime contract.",
    theory: `<p><strong>Transcript anchor (01:20:53):</strong> this is the shift from consuming public images to defining your own runtime artifact.</p>
<h3>Architecture Diagram</h3>
<pre><code>Application source + dependency manifest
    -> Dockerfile instructions
    -> image artifact
    -> runtime config (env/ports/volumes)
    -> containerized service behavior</code></pre>
<h3>Dockerization Checklist</h3>
<ul>
  <li>Choose a minimal compatible base image.</li>
  <li>Install dependencies deterministically.</li>
  <li>Set explicit startup command.</li>
  <li>Test from built image, not host runtime.</li>
  <li>Keep secrets out of image layers.</li>
</ul>
<p><strong>Theory principle:</strong> dockerization is an architecture contract. It should encode how software is expected to run, not just make the app start once.</p>`,
    example:
      "A FastAPI model endpoint can be dockerized with a clear startup contract and then validated in staging using the exact same image tag.",
    animation: "DockerLayerCacheLab",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "What makes dockerization production-grade instead of demo-grade?",
        "Why should testing run from image artifact and not local interpreter?",
        "What are the most common dockerization anti-patterns?",
      ],
      [
        "Deterministic dependencies, explicit startup/runtime config, secure handling of secrets, and reproducible image promotion.",
        "Host runtime may hide missing dependencies or configuration mismatches that only appear in actual container runtime.",
        "Mutable tags, hardcoded secrets, poor layer ordering, and weak runtime validation.",
      ],
      "Senior framing treats Dockerfile as versioned operations contract with release implications."
    ),
    flashCards: buildFlashCards([
      ["What is dockerization?", "Converting app runtime assumptions into reproducible image contract."],
      ["Why test from image artifact?", "To validate real deployable runtime behavior."],
      ["What should never be baked into image?", "Environment-specific secrets and mutable credentials."],
      ["What improves dockerization quality?", "Deterministic dependency and startup contracts."],
    ]),
  }),
  makeNode({
    slug: "11-publishing-images-to-docker-hub",
    order: 11,
    title: "Publishing Images to Docker Hub",
    excerpt:
      "Timestamp 01:35:00. Registry publishing, tag governance, release promotion, and rollback safety.",
    theory: `<p><strong>Transcript anchor (01:35:00):</strong> once image is built, distribution through registries enables consistent deployment across environments.</p>
<pre><code>docker build -t fraud-api:1.0 .
docker tag fraud-api:1.0 yourname/fraud-api:1.0
docker login
docker push yourname/fraud-api:1.0
docker pull yourname/fraud-api:1.0</code></pre>
<h3>Architecture Diagram</h3>
<pre><code>Build pipeline -> versioned image tag -> registry
      -> staging pull/validation
      -> production pull/deploy
      -> rollback via previous stable tag</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Registry as control plane:</strong> promotes identical artifacts across stages.</li>
  <li><strong>Tag governance:</strong> semantic or commit-linked tags preserve release traceability.</li>
  <li><strong>Risk reduction:</strong> deterministic rollback path during regressions.</li>
</ul>`,
    example:
      "A sentiment model API can publish `team/sentiment-api:model-v12` and reliably deploy that exact runtime across staging and production.",
    animation: "DockerReleaseFlowLab",
    tool: "DockerReleaseFlowLab",
    interviewPrep: buildInterviewPrep(
      [
        "Why is registry promotion safer than rebuilding per environment?",
        "How does tagging strategy affect incident response?",
        "What is wrong with relying exclusively on `latest`?",
      ],
      [
        "Rebuilds can produce divergence; promotion ensures same artifact passes through all release gates.",
        "Stable tags allow fast identification and rollback to last known-good runtime.",
        "Mutable tags remove deterministic traceability and can deploy unexpected changes.",
      ],
      "High-quality answers position registries as release governance infrastructure, not just storage."
    ),
    flashCards: buildFlashCards([
      ["Why push to Docker Hub/registry?", "To distribute and promote the same image artifact across environments."],
      ["What does `docker tag` enable?", "Release naming strategy and traceable artifact references."],
      ["What supports safe rollback?", "Immutable versioned tags with known-good history."],
      ["Why avoid latest-only workflows?", "They are non-deterministic and incident-prone."],
    ]),
  }),
  makeNode({
    slug: "12-docker-volumes",
    order: 12,
    title: "Docker Volumes",
    excerpt:
      "Timestamp 01:39:40. Persistent storage strategy with named volumes, anonymous volumes, bind mounts, and lifecycle cleanup.",
    theory: `<p><strong>Transcript anchor (01:39:40):</strong> containers are disposable, but data is not. Volumes keep state independent from container lifecycle.</p>
<h3>Architecture Diagram</h3>
<pre><code>Image (immutable runtime)
    + Container (ephemeral process state)
    + Volume (durable data state)
    -> predictable persistence behavior across restarts</code></pre>
<h3>Volume Types</h3>
<ul>
  <li><strong>Named volume:</strong> explicit and durable Docker-managed storage.</li>
  <li><strong>Anonymous volume:</strong> temporary Docker-managed storage, easy to orphan.</li>
  <li><strong>Bind mount:</strong> host path mapped into container, ideal for development workflows.</li>
</ul>
<pre><code>docker run -d -v pgdata:/var/lib/postgresql/data postgres:16
docker volume prune</code></pre>
<p><strong>Theory principle:</strong> never couple critical persistence to ephemeral container lifecycle assumptions.</p>`,
    example:
      "A feature-store database running in Docker must use persistent volume mapping so training/serving data survives container replacement.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "When should you choose named volume versus bind mount?",
        "What does `docker volume prune` actually clean?",
        "Why separate persistence strategy from image strategy?",
      ],
      [
        "Named volumes for durable app data; bind mounts for local development and controlled host integration.",
        "Unused local volumes, often anonymous or detached from running containers.",
        "Images model software contract; persistence models data lifecycle and durability guarantees.",
      ],
      "Senior answers separate immutable artifact design from mutable state design."
    ),
    flashCards: buildFlashCards([
      ["Why are volumes required?", "To preserve data outside ephemeral container filesystem layers."],
      ["Best default for durable DB data?", "Named volumes."],
      ["When is bind mount preferred?", "Developer workflows and direct host file editing."],
      ["What does `docker volume prune` do?", "Removes unused local volumes."],
    ]),
  }),
  makeNode({
    slug: "13-docker-networks",
    order: 13,
    title: "Docker Networks",
    excerpt:
      "Timestamp 01:59:45. Networking drivers, custom bridges, host/none behavior, and container communication debugging.",
    theory: `<p><strong>Transcript anchor (01:59:45):</strong> Docker networking defines traffic boundaries among containers, host, and external systems.</p>
<h3>Driver Types Covered</h3>
<ul>
  <li><strong>Bridge:</strong> default, isolated container network on single host.</li>
  <li><strong>Host:</strong> container shares host network namespace.</li>
  <li><strong>None:</strong> no external networking for container.</li>
</ul>
<pre><code>docker network ls
docker network create my-app-net
docker run -d --name api --network my-app-net api:1.0
docker run -d --name postgres --network my-app-net postgres:16</code></pre>
<h3>Architecture Diagram</h3>
<pre><code>Host client -> published port -> API container
API container -> shared bridge network -> DB container
API container -> optional outbound external services</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Custom bridge networks:</strong> cleaner service grouping and communication rules.</li>
  <li><strong>Internal vs external traffic:</strong> service discovery differs from host exposure.</li>
  <li><strong>Debug sequence:</strong> port mapping -> network membership -> dependency health.</li>
</ul>`,
    example:
      "A RAG service stack with API and vector DB can use custom bridge networking so services communicate by stable names, while only API port is exposed externally.",
    animation: "DockerNetworkFlowLab",
    tool: "DockerNetworkFlowLab",
    interviewPrep: buildInterviewPrep(
      [
        "Why are custom bridge networks often superior to default bridge in real projects?",
        "What is the practical risk of host networking?",
        "How do you debug connectivity in multi-container stacks quickly?",
      ],
      [
        "They provide clearer segmentation and service-level communication boundaries.",
        "Reduced isolation and higher chance of host-level port conflicts/ambiguity.",
        "Validate host exposure, verify shared network/service names, then check downstream dependency state.",
      ],
      "Best answers explicitly separate network topology from service health."
    ),
    flashCards: buildFlashCards([
      ["Default Docker network driver?", "Bridge."],
      ["Why use custom bridge network?", "Service isolation and cleaner communication model."],
      ["What does host driver imply?", "Container shares host network stack."],
      ["What does none driver imply?", "Container has no external network connectivity."],
    ]),
  }),
  makeNode({
    slug: "14-summary-and-cheat-sheet",
    order: 14,
    title: "Summary and Docker Cheat Sheet",
    excerpt:
      "Final revision node: full timeline recap, architecture-level synthesis, and cheat-sheet access for rapid command recall.",
    theory: `<p><strong>This is the consolidated summary node for the entire lecture flow.</strong> It integrates conceptual understanding, system design, and operational practice from the Hindi transcript into English revision notes.</p>
<h3>Timeline Recap (as requested)</h3>
<ul>
  <li>00:01:40 Introduction to Docker</li>
  <li>00:14:50 Docker Installation</li>
  <li>00:21:00 Docker Commands</li>
  <li>00:34:13 Docker Image Layers</li>
  <li>00:37:08 Port Binding</li>
  <li>00:42:45 Troubleshoot Commands and Logs</li>
  <li>00:45:30 Docker vs Virtual Machine</li>
  <li>00:48:43 Developing with Docker</li>
  <li>01:07:17 Docker Compose</li>
  <li>01:20:53 Dockerizing Our Application</li>
  <li>01:35:00 Publishing Images to Docker Hub</li>
  <li>01:39:40 Docker Volumes</li>
  <li>01:59:45 Docker Networks</li>
</ul>
<h3>Architecture Synthesis</h3>
<pre><code>Build plane: Dockerfile -> image layers -> tagged artifact
Runtime plane: container process -> ports/env/logs -> diagnostics
System plane: compose + volumes + networks -> multi-service behavior
Release plane: registry promotion -> staging validation -> rollback-ready production</code></pre>
<h3>Data Science Deployment Summary</h3>
<p>For model-centric systems, Docker's biggest value is end-to-end reproducibility: consistent runtime from notebook/prototype to API serving, with traceable versions and reliable rollback controls.</p>
<p><strong>Cheat sheet:</strong> <a href="${CHEAT_SHEET_URL}" target="_blank" rel="noreferrer">Open Docker Cheat Sheet PDF</a>.</p>
<p><strong>How to revise:</strong> use this summary node for architecture-level memory, the timeline visual for subsection recall, and the embedded PDF panel for command-level speed recall.</p>`,
    example:
      "Before production rollout, validate one full release rehearsal: build tagged image, run local integration with Compose, verify dependency paths, push to registry, test staging, then promote unchanged artifact.",
    animation: "DockerCourseTimelineStudio",
    tool: "DockerCheatSheetPanel",
    interviewPrep: buildInterviewPrep(
      [
        "How would you explain Docker to a data-platform interviewer in one coherent narrative?",
        "What are non-negotiable pre-production checks in containerized systems?",
        "How do Docker, Compose, volumes, and networks combine into one architecture story?",
      ],
      [
        "Docker standardizes runtime artifacts, Compose models service topology, volumes preserve state, and networks define communication boundaries for dependable releases.",
        "Image traceability, runtime config verification, dependency reachability checks, and rollback readiness.",
        "Docker handles packaging, Compose handles multi-service orchestration, volumes handle persistence, and networks handle communication paths.",
      ],
      "Senior answers emphasize reliability, governance, and incident readiness rather than command memorization alone."
    ),
    flashCards: buildFlashCards([
      ["Where is the Docker cheat sheet?", "At `/cheatsheets/docker-cheat-sheet.pdf`."],
      ["What are the four Docker system planes?", "Build, runtime, system topology, and release governance."],
      ["What enables safe rollback?", "Immutable tagged artifacts and staged validation workflow."],
      ["Why keep a summary node?", "To connect commands to architecture and operational reasoning."],
    ]),
  }),
];
