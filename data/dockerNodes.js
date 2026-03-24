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
      "Timestamp 00:01:40. Why Docker exists, what problem it solves, and how containers standardize software environments.",
    theory: `<p><strong>Lecture anchor (00:01:40):</strong> the transcript opens with a practical team pain point: local environments drift over time and cause the classic <em>it works on my machine</em> failure.</p>
<p><strong>Docker solves runtime inconsistency by packaging software with its execution assumptions.</strong> Instead of sharing setup docs and hoping every developer machine behaves the same, we share image definitions and run containers from those definitions.</p>
<p><strong>In plain architecture terms:</strong> code + dependency/runtime definition -> image artifact -> container instances across laptop, CI, and server.</p>
<h3>Architecture Flow</h3>
<ul>
  <li><strong>Without Docker:</strong> source code -> manual installation -> version mismatch -> hidden production risk.</li>
  <li><strong>With Docker:</strong> Dockerfile -> image -> consistent runtime process on any host with Docker.</li>
  <li><strong>Team effect:</strong> onboarding time drops and debugging becomes reproducible.</li>
</ul>
<h3>Data Science Relevance</h3>
<ul>
  <li><strong>Reproducible notebooks:</strong> same Python + system libs across machines.</li>
  <li><strong>Training/inference parity:</strong> avoid silently different runtime stacks.</li>
  <li><strong>MLOps reliability:</strong> move the same image through validation and deployment gates.</li>
</ul>`,
    example:
      "A fraud-model API built on one laptop can run the same way in CI and production when the team deploys a versioned Docker image instead of repeating manual setup.",
    animation: "DockerArchitectureViz",
    tool: "DockerArchitectureViz",
    interviewPrep: buildInterviewPrep(
      [
        "What problem does Docker solve that setup scripts alone do not?",
        "How does Docker reduce onboarding friction in large teams?",
        "Why is Docker critical in ML workflows, not just web apps?",
      ],
      [
        "Docker standardizes runtime behavior as a portable artifact. Setup scripts can still produce drift when host OS, package managers, or system libraries differ.",
        "New engineers run the same image or Compose stack instead of manually recreating fragile environment assumptions from docs.",
        "ML systems depend on exact runtime compatibility for libraries, model-serving dependencies, and sometimes GPU tooling. Docker reduces drift across those stages.",
      ],
      "Strong answers connect Docker to reliability economics: less environment drift means fewer late-stage failures and faster releases."
    ),
    flashCards: buildFlashCards([
      ["What is Docker's core value?", "Packaging applications with runtime assumptions into portable, reproducible artifacts."],
      ["What is environment drift?", "When machines run the same code with different runtime behavior because dependencies/config differ."],
      ["Why do teams adopt Docker early?", "To reduce setup friction, reproducibility issues, and deployment surprises."],
      ["Why does this matter in data science?", "Model and library compatibility is sensitive to runtime differences."],
    ]),
  }),
  makeNode({
    slug: "02-docker-installation",
    order: 2,
    title: "Docker Installation",
    excerpt:
      "Timestamp 00:14:50. Install Docker correctly, validate the daemon, and confirm your host is ready for containerized development.",
    theory: `<p><strong>Lecture anchor (00:14:50):</strong> installation is treated as a reliability step, not a checkbox. If daemon, CLI, or permissions are broken, all later commands fail unpredictably.</p>
<p><strong>Installation has three moving parts:</strong> Docker Engine (daemon), Docker CLI, and optional Docker Desktop UI tooling. The CLI sends commands to the daemon; the daemon builds/runs images and containers.</p>
<h3>Installation Architecture</h3>
<ul>
  <li><strong>CLI layer:</strong> <code>docker ...</code> commands from terminal.</li>
  <li><strong>Daemon layer:</strong> build, run, network, and storage execution.</li>
  <li><strong>Host layer:</strong> OS virtualization support and permissions model.</li>
</ul>
<h3>Verification Checklist</h3>
<pre><code>docker --version
docker version
docker info
docker run hello-world</code></pre>
<ul>
  <li><strong>If hello-world fails:</strong> check daemon status, user permissions, and host virtualization support.</li>
  <li><strong>If version mismatch appears:</strong> ensure CLI and daemon are from compatible install channels.</li>
  <li><strong>For team onboarding:</strong> document exact install baseline per OS.</li>
</ul>`,
    example:
      "A team onboarding doc can fail if it only says install Docker; a stronger doc also includes daemon verification and the expected output for `docker info`.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "What does `docker run hello-world` actually verify?",
        "Why can `docker --version` pass while Docker still doesn't work?",
        "How would you set an installation baseline for a team?",
      ],
      [
        "It validates end-to-end path: CLI -> daemon -> image pull/build cache -> container startup -> logs output.",
        "Because CLI presence alone does not guarantee daemon health, permissions, or virtualization support.",
        "I would specify OS-specific prerequisites, daemon verification commands, and a shared troubleshooting checklist.",
      ],
      "Senior framing: installation quality is an operational control point. Weak install baselines create long-tail debugging costs later."
    ),
    flashCards: buildFlashCards([
      ["What are the key Docker install components?", "CLI, daemon (Engine), and optional Desktop tooling."],
      ["Which command confirms daemon details?", "`docker info`"],
      ["What does hello-world validate?", "That Docker can fetch/run a container via a healthy daemon path."],
      ["Why document OS baseline?", "To avoid inconsistent team setup and recurring onboarding failures."],
    ]),
  }),
  makeNode({
    slug: "03-docker-commands",
    order: 3,
    title: "Docker Commands",
    excerpt:
      "Timestamp 00:21:00. Core command vocabulary for image lifecycle, container lifecycle, and runtime inspection.",
    theory: `<p><strong>Lecture anchor (00:21:00):</strong> Docker proficiency starts with object clarity: are you operating on images, containers, volumes, or networks?</p>
<p><strong>Command groups matter more than memorizing random flags.</strong> Build a mental model around image operations, runtime operations, and diagnostics.</p>
<h3>Command Families</h3>
<ul>
  <li><strong>Image lifecycle:</strong> <code>pull</code>, <code>build</code>, <code>images</code>, <code>rmi</code>, <code>tag</code>, <code>push</code>.</li>
  <li><strong>Container lifecycle:</strong> <code>run</code>, <code>ps</code>, <code>stop</code>, <code>start</code>, <code>rm</code>.</li>
  <li><strong>Diagnostics:</strong> <code>logs</code>, <code>exec</code>, <code>inspect</code>, <code>stats</code>.</li>
</ul>
<pre><code>docker build -t fraud-api:1.0 .
docker run -d --name fraud-api -p 8000:8000 fraud-api:1.0
docker ps
docker logs fraud-api
docker exec -it fraud-api sh</code></pre>
<h3>Interaction Pattern</h3>
<ul>
  <li><strong>Deploy path:</strong> build -> run -> inspect health.</li>
  <li><strong>Debug path:</strong> ps -> logs -> exec -> inspect.</li>
  <li><strong>Release path:</strong> tag -> push -> pull in target environment.</li>
</ul>`,
    example:
      "If an inference API fails after deployment, start with `docker ps` and `docker logs`, then `docker exec` into the container to confirm model path and env vars.",
    animation: "DockerCommandWorkbench",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Which three Docker commands do you run first during incident triage?",
        "What is the practical difference between `run` and `exec`?",
        "Why do teams avoid relying only on `latest` tags?",
      ],
      [
        "Typically `docker ps`, `docker logs`, and `docker inspect` (or `docker exec` when deeper in-container validation is needed).",
        "`run` creates/starts a new container from an image, while `exec` runs commands inside an already running container.",
        "Because `latest` weakens release traceability and rollback safety in production incidents.",
      ],
      "High-signal interview answers include both command names and the decision logic for command order."
    ),
    flashCards: buildFlashCards([
      ["Which command builds an image?", "`docker build`"],
      ["Which command views running containers?", "`docker ps`"],
      ["Which command enters a running container shell?", "`docker exec -it <name> sh`"],
      ["Why version image tags?", "Traceability, repeatable deployment, and rollback safety."],
    ]),
  }),
  makeNode({
    slug: "04-docker-image-layers",
    order: 4,
    title: "Docker Image Layers",
    excerpt:
      "Timestamp 00:34:13. How image layering and cache invalidation work, and why Dockerfile order changes build performance.",
    theory: `<p><strong>Lecture anchor (00:34:13):</strong> image layers are the performance foundation of Docker builds. Every instruction in a Dockerfile produces a layer that may be cached and reused.</p>
<p><strong>Layer order determines rebuild cost.</strong> Put stable and expensive steps (dependency install) before volatile steps (application source copy) to preserve cache reuse.</p>
<h3>Layering Architecture</h3>
<ul>
  <li><strong>Base layer:</strong> runtime foundation (e.g., Python image).</li>
  <li><strong>Dependency layer:</strong> package installation.</li>
  <li><strong>Application layer:</strong> frequently changing source code.</li>
  <li><strong>Runtime command layer:</strong> startup entrypoint metadata.</li>
</ul>
<pre><code>FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]</code></pre>
<h3>Interaction Example</h3>
<p>If only source files change, a cache-friendly order avoids reinstalling dependencies, reducing CI build time dramatically across every pull request.</p>`,
    example:
      "For a recommendation API, copying `requirements.txt` first keeps dependency layers cached while business logic evolves rapidly.",
    animation: "DockerLayerCacheLab",
    tool: "DockerLayerCacheLab",
    interviewPrep: buildInterviewPrep(
      [
        "Why does Dockerfile order affect both local and CI throughput?",
        "What happens when an early Dockerfile instruction changes?",
        "How do you optimize build speed for ML-serving images?",
      ],
      [
        "Layer cache reuse depends on deterministic instruction history. Better ordering prevents expensive rebuilds in both local and CI pipelines.",
        "That instruction and all subsequent layers are invalidated and rebuilt.",
        "Stabilize base/dependency layers, isolate frequently changed code layers, and avoid unnecessary build context content.",
      ],
      "Senior-level responses tie layer strategy to engineering productivity metrics like CI duration and deployment frequency."
    ),
    flashCards: buildFlashCards([
      ["What creates a layer in Docker?", "Most Dockerfile instructions create layers."],
      ["What is cache invalidation in Docker?", "When a changed instruction forces rebuild of that layer and downstream layers."],
      ["Where should dependency install usually be placed?", "Before copying frequently changing source code."],
      ["Why care about layers in teams?", "They directly impact build speed, CI cost, and developer feedback loops."],
    ]),
  }),
  makeNode({
    slug: "05-port-binding",
    order: 5,
    title: "Port Binding",
    excerpt:
      "Timestamp 00:37:08. Understand host-to-container traffic mapping and avoid the most common runtime reachability failures.",
    theory: `<p><strong>Lecture anchor (00:37:08):</strong> a healthy container can still be unreachable if host and container ports are not mapped correctly.</p>
<p><strong>Port binding links external clients to internal container services.</strong> If your app listens on container port 8000, publish it via <code>-p host:container</code> so host/browser traffic can enter.</p>
<pre><code>docker run -d --name scoring-api -p 8000:8000 scoring-api:1.0
docker run -d --name jupyter -p 8888:8888 jupyter/base-notebook</code></pre>
<h3>Port Path Architecture</h3>
<ul>
  <li><strong>Client request:</strong> browser/curl to host port.</li>
  <li><strong>Host mapping:</strong> Docker forwards to container port.</li>
  <li><strong>Container app:</strong> must actually listen on mapped internal port.</li>
</ul>
<h3>Failure Pattern</h3>
<ul>
  <li>Port published incorrectly (e.g., <code>-p 8000:5000</code> while app listens on 8000).</li>
  <li>App binds only localhost inside container instead of <code>0.0.0.0</code>.</li>
  <li>Service is up but startup failed before listener initialized.</li>
</ul>`,
    example:
      "A FastAPI service may appear running, but if it binds to localhost in-container, host traffic on mapped port still fails.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "A container is running but endpoint is unreachable. What do you check first?",
        "Why does binding to `0.0.0.0` matter in containers?",
        "How do you explain host:container mapping to juniors?",
      ],
      [
        "Validate `docker ps` port mapping, confirm app listener port, and inspect startup logs for runtime failures.",
        "Because container networking needs the app to listen on an externally reachable interface, not just loopback.",
        "Host port is where the outside request enters; container port is where the app actually listens.",
      ],
      "Best answers separate process health from traffic reachability and show concrete troubleshooting order."
    ),
    flashCards: buildFlashCards([
      ["What does `-p 8000:8000` represent?", "Host port 8000 mapped to container port 8000."],
      ["Can a running container still be unreachable?", "Yes, if port mapping/listener config is wrong."],
      ["Which command quickly shows published ports?", "`docker ps`"],
      ["Why check app bind address?", "Listening only on localhost can block external access."],
    ]),
  }),
  makeNode({
    slug: "06-troubleshoot-commands-and-logs",
    order: 6,
    title: "Troubleshoot Commands and Logs",
    excerpt:
      "Timestamp 00:42:45. Systematic container debugging with logs, inspect, exec, and runtime state checks.",
    theory: `<p><strong>Lecture anchor (00:42:45):</strong> debugging Docker requires disciplined sequence, not random commands.</p>
<p><strong>Primary diagnostic loop:</strong> identify state, inspect logs, enter container if needed, and verify dependencies.</p>
<pre><code>docker ps -a
docker logs -f api
docker inspect api
docker exec -it api sh
docker stats</code></pre>
<h3>Triage Architecture</h3>
<ul>
  <li><strong>State layer:</strong> is container running or crashing repeatedly?</li>
  <li><strong>Application layer:</strong> what do logs reveal about startup/config?</li>
  <li><strong>Dependency layer:</strong> is DB/cache/external API reachable?</li>
  <li><strong>Resource layer:</strong> CPU/memory pressure causing process instability?</li>
</ul>
<h3>Interaction Scenarios</h3>
<ul>
  <li><strong>Crash loop:</strong> wrong startup command or missing required env.</li>
  <li><strong>Silent failure:</strong> app starts but downstream connections time out.</li>
  <li><strong>Performance issue:</strong> container live but throttled under load.</li>
</ul>`,
    example:
      "An API may pass health checks but fail real requests if model artifacts are missing; `docker exec` can verify file paths directly.",
    animation: "DockerCommandWorkbench",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "What is your first-minute debugging sequence in a Docker incident?",
        "When do you use `inspect` instead of `logs`?",
        "How do you isolate app errors from dependency failures?",
      ],
      [
        "I check container state with `ps -a`, stream logs, then inspect config/network metadata and execute inside container for direct validation.",
        "`inspect` is better for structural metadata (ports, env, mounts, network), while logs show runtime behavior.",
        "I validate app startup first, then test dependency reachability from inside the container using service hostnames and ports.",
      ],
      "Senior responses emphasize repeatable triage playbooks and fast isolation of failure domains."
    ),
    flashCards: buildFlashCards([
      ["Best first command for container state?", "`docker ps -a`"],
      ["Best command for live app behavior?", "`docker logs -f <container>`"],
      ["What does `docker inspect` provide?", "Detailed metadata: env, mounts, network, and runtime configuration."],
      ["Why use `docker exec`?", "To validate runtime filesystem/env/process details from inside the container."],
    ]),
  }),
  makeNode({
    slug: "07-docker-vs-virtual-machine",
    order: 7,
    title: "Docker vs Virtual Machine",
    excerpt:
      "Timestamp 00:45:30. Compare containers and VMs by architecture, isolation model, startup overhead, and deployment density.",
    theory: `<p><strong>Lecture anchor (00:45:30):</strong> Docker containers and virtual machines both isolate workloads, but they isolate at different layers.</p>
<p><strong>VM model:</strong> each VM includes full guest OS and kernel abstraction. <strong>Container model:</strong> workloads share host kernel while isolating processes/filesystem/network namespaces.</p>
<h3>Architectural Comparison</h3>
<ul>
  <li><strong>VM:</strong> app + libs + full guest OS (stronger isolation, heavier footprint).</li>
  <li><strong>Container:</strong> app + libs on shared kernel (faster startup, denser packing).</li>
  <li><strong>Tradeoff:</strong> containers prioritize portability and speed; VMs prioritize full OS isolation boundaries.</li>
</ul>
<h3>Data Platform Implications</h3>
<ul>
  <li>Use containers for model APIs, ETL services, schedulers, and local integration stacks.</li>
  <li>Use VMs when you need strict kernel/OS separation or legacy system constraints.</li>
</ul>`,
    example:
      "A model-serving service can scale quickly via containers, while a legacy enterprise dependency requiring a custom OS image may still run better in a VM boundary.",
    animation: "DockerArchitectureViz",
    tool: "DockerArchitectureViz",
    interviewPrep: buildInterviewPrep(
      [
        "Why are containers usually faster to start than VMs?",
        "When would you still choose a VM over Docker?",
        "What is the most interview-relevant container vs VM tradeoff?",
      ],
      [
        "Containers avoid booting full guest OS instances and reuse host kernel primitives.",
        "When strong OS/kernel isolation, legacy OS compatibility, or compliance boundaries require VM-level separation.",
        "Speed and density vs isolation depth. Containers improve delivery speed; VMs may improve isolation guarantees.",
      ],
      "A senior answer is nuanced: this is not replacement rhetoric; it is workload-fit architecture."
    ),
    flashCards: buildFlashCards([
      ["Main reason containers are lightweight?", "They share host kernel instead of bundling full guest OS."],
      ["Main VM advantage?", "Stronger OS-level isolation and kernel independence."],
      ["Main container advantage?", "Fast startup and efficient resource utilization."],
      ["Can teams use both?", "Yes, mixed architectures are common and often optimal."],
    ]),
  }),
  makeNode({
    slug: "08-developing-with-docker",
    order: 8,
    title: "Developing with Docker",
    excerpt:
      "Timestamp 00:48:43. Practical local development workflow using containers, mounts, environment config, and iterative testing.",
    theory: `<p><strong>Lecture anchor (00:48:43):</strong> Docker is not only for deployment; it can be your day-to-day development environment.</p>
<p><strong>Local dev with Docker should optimize feedback loops.</strong> Use bind mounts for live code edits, environment variables for stage config, and stable base images for repeatable teammate setup.</p>
<h3>Development Architecture</h3>
<ul>
  <li><strong>Source layer:</strong> host filesystem as source of truth via bind mounts.</li>
  <li><strong>Runtime layer:</strong> containerized app process and dependencies.</li>
  <li><strong>Service layer:</strong> local DB/cache/broker in companion containers.</li>
</ul>
<pre><code>docker run -it --rm \\
  -v $(pwd):/app \\
  -w /app \\
  -p 3000:3000 \\
  -e NODE_ENV=development \\
  node:20 sh</code></pre>
<h3>Interaction Example</h3>
<p>Developer edits code on host, container runtime reloads app, API calls hit containerized DB on shared network. Same workflow can be replicated across team machines.</p>`,
    example:
      "A data scientist can run a notebook server in Docker with mounted project files and pinned dependencies, while teammates reproduce the same setup with one command.",
    animation: "DockerMlOpsPipelineStudio",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "What makes Docker-based local development productive instead of slow?",
        "Why are bind mounts common in dev but less preferred in production?",
        "How do you keep dev and prod reasonably aligned?",
      ],
      [
        "Fast rebuild strategy, proper bind mounts, and clear separation of image build concerns vs runtime config concerns.",
        "Bind mounts are ideal for iterative local edits but can create host-coupled behavior that is risky in production environments.",
        "Use shared image baselines and explicit config contracts, while allowing dev-only conveniences through profile-specific overrides.",
      ],
      "Strong interview answers balance developer ergonomics with production discipline."
    ),
    flashCards: buildFlashCards([
      ["Why use bind mounts in development?", "To reflect host code changes instantly inside containers."],
      ["What is a key dev/prod alignment principle?", "Keep core runtime artifact consistent and vary only environment configuration."],
      ["Why avoid rebuilding on every tiny edit?", "It slows feedback loops and hurts developer throughput."],
      ["What is Docker's dev-team advantage?", "Consistent local environments across contributors."],
    ]),
  }),
  makeNode({
    slug: "09-docker-compose",
    order: 9,
    title: "Docker Compose",
    excerpt:
      "Timestamp 01:07:17. Declarative multi-container orchestration for local integration stacks and service coordination.",
    theory: `<p><strong>Lecture anchor (01:07:17):</strong> Compose organizes multiple interdependent services using a single configuration file.</p>
<p><strong>Compose converts shell command sprawl into versioned infrastructure-as-code.</strong> Teams can review service topology, ports, networks, volumes, and dependencies in one place.</p>
<pre><code>services:
  api:
    build: .
    ports: ["8000:8000"]
    depends_on: [postgres]
  postgres:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:</code></pre>
<h3>Architecture Benefits</h3>
<ul>
  <li><strong>Service discovery:</strong> containers communicate by service names.</li>
  <li><strong>Repeatability:</strong> one command boots full local stack.</li>
  <li><strong>Collaboration:</strong> topology lives in source control, not tribal memory.</li>
</ul>
<h3>Data Project Interaction Example</h3>
<p>Run API + Postgres + Redis + experiment tracking service locally to test complete model-serving flow before cloud deployment.</p>`,
    example:
      "A recommendation platform can validate feature lookup, model scoring, and response caching by running all dependencies in one Compose stack.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Why does Compose improve team reliability compared to ad-hoc run commands?",
        "How do services discover each other in Compose?",
        "Where does Compose fit in an MLOps lifecycle?",
      ],
      [
        "It centralizes runtime contracts and dependency topology in version-controlled config.",
        "Usually through the shared Compose network using service names as hostnames.",
        "Great for local integration and pre-production validation before promoting artifacts to orchestrated runtime platforms.",
      ],
      "Senior answers position Compose as a systems-thinking tool, not just convenience syntax."
    ),
    flashCards: buildFlashCards([
      ["What does Compose manage?", "Multi-container application stacks declaratively."],
      ["Main command to start stack?", "`docker compose up`"],
      ["How do services usually communicate?", "By service names over shared Compose network."],
      ["Why is Compose useful pre-production?", "It validates multi-service interaction before deployment."],
    ]),
  }),
  makeNode({
    slug: "10-dockerizing-our-application",
    order: 10,
    title: "Dockerizing Our Application",
    excerpt:
      "Timestamp 01:20:53. Convert an existing app into a clean, portable container image with production-aware Dockerfile design.",
    theory: `<p><strong>Lecture anchor (01:20:53):</strong> dockerizing means defining a repeatable runtime contract for your own application, not just running existing images.</p>
<p><strong>The process is architectural:</strong> choose base image, set workdir, copy dependencies, install runtime packages, copy source, expose service port, define startup command.</p>
<h3>Dockerization Blueprint</h3>
<ol>
  <li>Pick minimal compatible base image.</li>
  <li>Define deterministic dependency install steps.</li>
  <li>Copy source and set runtime command.</li>
  <li>Run local validation from built image, not host env.</li>
</ol>
<pre><code>docker build -t fraud-api:1.0 .
docker run -d --name fraud-api -p 8000:8000 fraud-api:1.0</code></pre>
<h3>Theory Deepening</h3>
<ul>
  <li><strong>Build-time vs runtime separation:</strong> avoid leaking env-specific secrets into image.</li>
  <li><strong>Image immutability:</strong> treat image as release artifact, not mutable server state.</li>
  <li><strong>Validation discipline:</strong> test what you actually ship.</li>
</ul>`,
    example:
      "A notebook prototype can be transformed into a production API container by moving model loading, dependency install, and startup command into Dockerfile-defined runtime.",
    animation: "DockerLayerCacheLab",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "What does clean dockerization of an app require beyond writing a Dockerfile?",
        "Why should image testing happen from built artifact, not host runtime?",
        "What mistakes cause brittle dockerized apps?",
      ],
      [
        "Clear runtime contract, deterministic dependency installation, explicit startup behavior, and environment-agnostic image design.",
        "Because host environment can mask issues that only appear inside the real deployable artifact.",
        "Over-reliance on host assumptions, poor layer ordering, hardcoded secrets, and weak startup/health verification.",
      ],
      "Senior responses show lifecycle thinking: build, validate, release, operate."
    ),
    flashCards: buildFlashCards([
      ["What is dockerization?", "Converting app runtime into reproducible image definition."],
      ["Why test from built image?", "To validate the actual deployable artifact behavior."],
      ["Why keep secrets out of image?", "Security and environment portability."],
      ["What is a release artifact here?", "A version-tagged Docker image."],
    ]),
  }),
  makeNode({
    slug: "11-publishing-images-to-docker-hub",
    order: 11,
    title: "Publishing Images to Docker Hub",
    excerpt:
      "Timestamp 01:35:00. Tag, authenticate, and publish images to registries for team sharing and controlled promotion workflows.",
    theory: `<p><strong>Lecture anchor (01:35:00):</strong> after dockerizing, the next step is distribution. Registries like Docker Hub let teams pull the same versioned artifact everywhere.</p>
<p><strong>Publishing workflow:</strong> build -> tag -> login -> push -> pull in target environment.</p>
<pre><code>docker build -t fraud-api:1.0 .
docker tag fraud-api:1.0 yourname/fraud-api:1.0
docker login
docker push yourname/fraud-api:1.0
docker pull yourname/fraud-api:1.0</code></pre>
<h3>Release Architecture</h3>
<ul>
  <li><strong>Producer side:</strong> CI or developer builds and pushes immutable tags.</li>
  <li><strong>Consumer side:</strong> staging/prod pull exact tag.</li>
  <li><strong>Governance:</strong> tags map to commit/model versions for auditability.</li>
</ul>
<h3>Interaction Example</h3>
<p>Release candidate fails in staging. Team rolls back by redeploying previous known-good image tag without rebuilding.</p>`,
    example:
      "A data-science API can publish `team/reco-api:model-v17` so serving stacks in staging and production consume exactly the same model-coupled runtime.",
    animation: "DockerMlOpsPipelineStudio",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Why is image tagging strategy crucial for production ML systems?",
        "What is the operational risk of using only `latest`?",
        "How does publishing to Docker Hub support CI/CD?",
      ],
      [
        "Tags create traceable release lineage between code, runtime, and model version.",
        "You lose deterministic rollback and may unknowingly deploy changed artifacts.",
        "CI can build once, push artifact once, and promote the same artifact across environments.",
      ],
      "High-quality answers frame registries as control planes for release consistency."
    ),
    flashCards: buildFlashCards([
      ["What does `docker tag` do?", "Assigns a new repository/name:tag reference to an image."],
      ["Why push images to registry?", "To share and deploy identical artifacts across environments."],
      ["What is the rollback-friendly practice?", "Use immutable, meaningful version tags."],
      ["Why avoid `latest` only?", "It weakens traceability and reproducibility."],
    ]),
  }),
  makeNode({
    slug: "12-docker-volumes",
    order: 12,
    title: "Docker Volumes",
    excerpt:
      "Timestamp 01:39:40. Persist state outside container lifecycle using named volumes, anonymous volumes, and bind mounts.",
    theory: `<p><strong>Lecture anchor (01:39:40):</strong> containers are ephemeral, but application data is not. Volumes separate persistent state from disposable runtime.</p>
<h3>Volume Types</h3>
<ul>
  <li><strong>Named volume:</strong> explicit Docker-managed durable storage.</li>
  <li><strong>Anonymous volume:</strong> Docker-managed but unnamed and harder to track over time.</li>
  <li><strong>Bind mount:</strong> direct host path mapped into container.</li>
</ul>
<pre><code># named volume
docker run -d -v pgdata:/var/lib/postgresql/data postgres:16

# bind mount
docker run -it -v $(pwd):/app node:20 sh

# cleanup unused volumes
docker volume prune</code></pre>
<h3>Storage Architecture Principle</h3>
<ul>
  <li><strong>Images:</strong> immutable software.</li>
  <li><strong>Volumes:</strong> mutable data lifecycle.</li>
  <li><strong>Operational rule:</strong> never assume container deletion should delete business-critical state.</li>
</ul>`,
    example:
      "A feature-store prototype can run Postgres with named volumes so data survives container restarts during local experimentation.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "When should you prefer named volumes over bind mounts?",
        "Why is persistence design independent from Dockerfile design?",
        "What is `docker volume prune` used for?",
      ],
      [
        "Use named volumes when Docker-managed durable storage is preferred and host path coupling should be reduced.",
        "Because image build concerns immutable runtime, while persistence concerns mutable data lifecycle.",
        "To remove unused local volumes, especially after iterative development or temporary runs.",
      ],
      "Strong answers clearly separate artifact immutability from data durability responsibilities."
    ),
    flashCards: buildFlashCards([
      ["Why do Docker volumes exist?", "To persist data beyond container lifecycle."],
      ["What is a named volume?", "A Docker-managed durable volume with explicit name."],
      ["When are bind mounts useful?", "Local development and controlled host file sharing."],
      ["What command cleans unused volumes?", "`docker volume prune`"],
    ]),
  }),
  makeNode({
    slug: "13-docker-networks",
    order: 13,
    title: "Docker Networks",
    excerpt:
      "Timestamp 01:59:45. Network drivers, container connectivity, custom bridge networks, and practical traffic debugging.",
    theory: `<p><strong>Lecture anchor (01:59:45):</strong> networking defines container communication paths: container-to-container, host-to-container, and container-to-external systems.</p>
<h3>Driver Types from Transcript</h3>
<ul>
  <li><strong>Bridge:</strong> default and most common for multi-container communication on one host.</li>
  <li><strong>Host:</strong> container uses host network stack directly.</li>
  <li><strong>None:</strong> isolated container with no external network connectivity.</li>
</ul>
<pre><code>docker network ls
docker network create my-app-net
docker run -d --name api --network my-app-net api:1.0
docker run -d --name postgres --network my-app-net postgres:16</code></pre>
<h3>Custom Bridge Advantage</h3>
<ul>
  <li>Cleaner service grouping and communication boundaries.</li>
  <li>Easier service-name-based interaction between containers.</li>
  <li>Better local simulation of real distributed app behavior.</li>
</ul>
<h3>Connectivity Debug Flow</h3>
<ol>
  <li>Check host-to-service path (port publishing + listener).</li>
  <li>Check service-to-service path (same network + correct hostnames).</li>
  <li>Check dependency health (DB/cache/vector store availability).</li>
</ol>`,
    example:
      "An AI retrieval stack with API, Postgres, and vector DB can run on a custom bridge network so services communicate by stable names.",
    animation: "DockerNetworkFlowLab",
    tool: "DockerNetworkFlowLab",
    interviewPrep: buildInterviewPrep(
      [
        "Why are custom bridge networks often preferred over default bridge?",
        "What does host networking trade off for convenience?",
        "How do you debug network issues in containerized systems quickly?",
      ],
      [
        "They provide cleaner segmentation and simpler service-to-service communication semantics.",
        "It reduces network isolation and can increase port conflict/risk exposure.",
        "Validate published ports, network membership, service hostnames, and dependency health in sequence.",
      ],
      "Best answers separate internal service discovery from external exposure and show deterministic debugging flow."
    ),
    flashCards: buildFlashCards([
      ["Most common Docker network driver?", "Bridge."],
      ["Why create custom bridge network?", "To group related containers and simplify communication."],
      ["What does host driver do?", "Shares host network namespace with container."],
      ["What does none driver do?", "Removes external network connectivity."],
    ]),
  }),
  makeNode({
    slug: "14-summary-and-cheat-sheet",
    order: 14,
    title: "Summary and Docker Cheat Sheet",
    excerpt:
      "Final wrap-up. Complete timeline summary, revision map, and embedded/downloadable Docker cheat sheet.",
    theory: `<p><strong>Course summary:</strong> this Docker topic now follows the exact lecture progression from introduction to networks, with deeper theory and interview-oriented framing.</p>
<h3>Timeline Recap</h3>
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
<h3>Architecture-Level Summary</h3>
<ul>
  <li><strong>Build plane:</strong> Dockerfile, layers, image caching, artifact tagging.</li>
  <li><strong>Runtime plane:</strong> port binding, env config, logs/inspect diagnostics.</li>
  <li><strong>System plane:</strong> Compose, volumes, networks, registry promotion flow.</li>
  <li><strong>MLOps plane:</strong> reproducibility, traceable release tags, rollback-ready deployments.</li>
</ul>
<p><strong>Cheat sheet access:</strong> <a href="${CHEAT_SHEET_URL}" target="_blank" rel="noreferrer">Open Docker Cheat Sheet PDF</a>.</p>
<p><strong>Revision tip:</strong> use the cheat sheet for command recall and the topic pages for architectural reasoning and interview preparation.</p>`,
    example:
      "Before production push, rehearse locally: build tagged image, run API with correct ports/env, validate dependencies with Compose, then promote the same immutable image through staging to production.",
    animation: "DockerMlOpsPipelineStudio",
    tool: "DockerCheatSheetPanel",
    interviewPrep: buildInterviewPrep(
      [
        "How would you explain Docker end-to-end to a data platform hiring panel?",
        "What checkpoints should exist before production promotion?",
        "How do Docker, Compose, volumes, and networks connect in one design story?",
      ],
      [
        "Docker standardizes runtime artifacts, Compose models service topology, volumes preserve state, and networks define communication boundaries. Together they make releases reproducible and debuggable.",
        "Image tag traceability, runtime config verification, dependency connectivity checks, and rollback path readiness.",
        "Image handles packaging, Compose handles orchestration, volumes handle persistence, and networks handle communication topology.",
      ],
      "Senior answer pattern: emphasize systems reliability, release governance, and operational observability as first-class design concerns."
    ),
    flashCards: buildFlashCards([
      ["Where is the Docker cheat sheet in this project?", "At `/cheatsheets/docker-cheat-sheet.pdf`."],
      ["What are Docker's four core planes?", "Build, runtime, system, and MLOps/release governance."],
      ["What enables safe rollback?", "Immutable image tags with traceable release metadata."],
      ["Why combine cheat sheet with topic pages?", "Commands need conceptual context for real incident and design decisions."],
    ]),
  }),
];
