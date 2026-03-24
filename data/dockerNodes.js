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
    slug: "01-why-docker",
    order: 1,
    title: "Why Docker Exists",
    excerpt:
      "Environment drift, reproducibility, and the classic 'works on my machine' problem explained through a real team-development lens.",
    theory: `<p><strong>Docker solves an environment-distribution problem, not just a packaging problem.</strong> The transcript begins with the exact pain point most teams hit: one developer has Node 16 and MongoDB 4.2 working locally, while another person installs newer versions and suddenly the same application behaves differently. The codebase may be identical, but the surrounding runtime is not.</p>
<p><strong>That mismatch is expensive in real software teams.</strong> Manual installation multiplies error sources: wrong runtime versions, missing system libraries, inconsistent CLI tools, and undocumented local setup steps. When teams grow, the problem scales faster than the feature work. Docker gives us a standard, portable way to ship <em>the application plus the runtime assumptions</em> together.</p>
<p><strong>A container is an isolated execution environment for one workload.</strong> Instead of asking every teammate, CI runner, and server to reconstruct the environment by hand, we build one agreed runtime definition and start containers from it repeatedly. That is why Docker is so useful in software delivery, DevOps, platform engineering, and machine learning workflows.</p>
<h3>Architecture Reading</h3>
<ul>
  <li><strong>Without Docker:</strong> source code -> manual setup -> local differences -> hidden bugs.</li>
  <li><strong>With Docker:</strong> source code + dependency recipe -> image -> reproducible containers on laptops, CI, and servers.</li>
  <li><strong>Operational benefit:</strong> onboarding becomes faster because setup moves from tribal knowledge to executable infrastructure.</li>
</ul>
<h3>Why This Matters In Data Science Projects</h3>
<ul>
  <li><strong>Notebook reproducibility:</strong> Python, CUDA, OS packages, and ML libraries often need exact combinations.</li>
  <li><strong>Training and inference parity:</strong> the model-serving image should closely match the environment used to validate the model.</li>
  <li><strong>Pipeline portability:</strong> feature jobs, schedulers, API services, and vector databases can be moved between machines far more safely.</li>
</ul>
<blockquote>Docker is most valuable when the environment itself is part of the product. In modern AI and data systems, that is almost always true.</blockquote>
<pre><code>Typical team workflow
1. Define runtime once
2. Build a Docker image
3. Run the same container locally, in CI, and on the server
4. Debug one environment definition instead of ten ad-hoc machines</code></pre>`,
    example:
      "A data science team trains a fraud model on one machine, validates it in CI, and serves it behind a FastAPI endpoint. Docker keeps Python, package, and OS-level dependencies aligned across all three stages.",
    animation: "DockerArchitectureViz",
    tool: null,
    interviewPrep: buildInterviewPrep(
      [
        "Why is Docker especially useful in machine learning and data science teams?",
        "What does Docker fix that virtual environments alone do not fully solve?",
        "How would you explain 'works on my machine' to a non-platform stakeholder?",
      ],
      [
        "Machine learning stacks depend on more than Python packages. Teams also need consistent OS libraries, system tools, database clients, model-serving runtimes, and sometimes GPU dependencies. Docker captures more of that runtime contract and makes onboarding, CI, and deployment far more reproducible.",
        "A Python virtual environment manages Python packages, but it does not standardize the full operating context. Docker packages the application with the broader execution environment, including filesystem layout, exposed ports, environment variables, and system-level dependencies.",
        "It means the source code is not the whole system. The code may be fine, but different machines have different runtimes, package versions, or configuration. Docker reduces those hidden differences by making the runtime definition explicit and portable.",
      ],
      "A strong answer connects Docker to reproducibility, operational speed, and risk reduction. In data projects, mention dependency drift, CI parity, and easier rollback when a model-serving stack changes."
    ),
    flashCards: buildFlashCards([
      ["What core problem does Docker solve?", "It standardizes how an application and its runtime dependencies are packaged and run across environments."],
      ["Why do teams hit 'works on my machine' bugs?", "Because code moves between machines faster than runtimes, tools, and configuration stay aligned."],
      ["Why is Docker useful for ML systems?", "It improves reproducibility across experimentation, validation, and deployment."],
      ["What gets distributed in a Docker workflow?", "A runtime definition that becomes an image and then one or more running containers."],
    ]),
  }),
  makeNode({
    slug: "02-images-containers-vms",
    order: 2,
    title: "Docker Images, Containers, and Virtual Machines",
    excerpt:
      "Understand the blueprint-instance model in Docker and why containers are lighter than full virtual machines.",
    theory: `<p><strong>An image is the blueprint; a container is the running instance.</strong> This distinction is the conceptual center of Docker. An image is a packaged, versioned definition of a runtime. A container is what you get when that definition is started as a process.</p>
<p><strong>Images are immutable artifacts.</strong> They are built from instructions and stored in a registry such as Docker Hub. Containers are mutable runtime instances created from those images. You can start many containers from the same image, just as you can launch many processes from the same executable.</p>
<p><strong>Virtual machines package a full guest operating system.</strong> Containers instead share the host kernel and isolate processes, filesystems, and networking namespaces. That difference is why containers are usually much smaller and faster to start.</p>
<h3>Image vs Container</h3>
<ul>
  <li><strong>Image:</strong> read-only template, versioned, shareable, stored in a registry.</li>
  <li><strong>Container:</strong> live running unit with process state, writable runtime layer, logs, and network identity.</li>
  <li><strong>Registry:</strong> storage and distribution layer for images.</li>
</ul>
<h3>Containers vs VMs</h3>
<ul>
  <li><strong>VM:</strong> app + libraries + full guest OS. Strong isolation, higher overhead.</li>
  <li><strong>Container:</strong> app + libraries, sharing host kernel. Lower overhead, faster startup, denser packing.</li>
  <li><strong>Practical consequence:</strong> containers are ideal for application packaging; VMs are useful when full OS isolation is required.</li>
</ul>
<h3>Data-Project Reading</h3>
<p>A model-serving team might publish an image tagged <code>fraud-api:1.4.2</code>. From that one image, they can run containers for local testing, staging validation, load testing, and production rollout. The image is the release artifact; the containers are the actual running services.</p>
<pre><code>Image lifecycle
Dockerfile -> docker build -> image tag -> push to registry

Container lifecycle
docker run image -> process starts -> logs/state/network exist -> stop/remove container</code></pre>`,
    example:
      "If your team builds `customer-segmentation-api:latest`, that image can power many containers: one on a laptop, one in CI, one in staging, and multiple replicas in production.",
    animation: "DockerArchitectureViz",
    tool: "DockerArchitectureViz",
    interviewPrep: buildInterviewPrep(
      [
        "What is the difference between a Docker image and a Docker container?",
        "Why are containers usually lighter than virtual machines?",
        "When would you still choose a VM instead of a container?",
      ],
      [
        "An image is the packaged template that defines the runtime. A container is the active running instance created from that image. Images are the artifacts you version and distribute; containers are the workloads you observe and operate.",
        "Containers reuse the host kernel, so they do not boot a separate guest operating system. That removes a large amount of overhead in storage, memory, and startup time.",
        "A VM is still useful when you need strong OS-level isolation, different kernels, legacy operating systems, or infrastructure boundaries that go beyond application packaging.",
      ],
      "Good interview answers emphasize that images are release artifacts and containers are runtime processes. For senior answers, tie that to versioning, rollback, and reproducible deployment."
    ),
    flashCards: buildFlashCards([
      ["What is a Docker image?", "A versioned, shareable runtime blueprint used to start containers."],
      ["What is a Docker container?", "A running isolated process instance created from an image."],
      ["Why do containers start faster than VMs?", "They share the host kernel instead of booting a full guest OS."],
      ["What usually lives in a registry?", "Docker images, not running containers."],
    ]),
  }),
  makeNode({
    slug: "03-core-docker-commands",
    order: 3,
    title: "Core Docker Commands and Container Lifecycle",
    excerpt:
      "Learn the command vocabulary for pulling, building, running, inspecting, and cleaning up containers safely.",
    theory: `<p><strong>Docker becomes practical only when the command vocabulary is clear.</strong> The transcript spends a lot of time on operational commands because teams need to do four things repeatedly: fetch images, build new ones, run containers, and inspect failures.</p>
<p><strong>The most important mindset is lifecycle-based.</strong> Ask: are you interacting with images, containers, or registries? Most command confusion disappears when you classify the object first.</p>
<h3>Essential Command Families</h3>
<ul>
  <li><strong>Image management:</strong> <code>docker pull</code>, <code>docker build</code>, <code>docker images</code>, <code>docker rmi</code>.</li>
  <li><strong>Container lifecycle:</strong> <code>docker run</code>, <code>docker ps</code>, <code>docker stop</code>, <code>docker start</code>, <code>docker rm</code>.</li>
  <li><strong>Runtime inspection:</strong> <code>docker logs</code>, <code>docker exec</code>, <code>docker inspect</code>.</li>
  <li><strong>Registry operations:</strong> <code>docker tag</code>, <code>docker push</code>, <code>docker pull</code>.</li>
</ul>
<pre><code># Pull a ready-made image
docker pull mongo:7

# Build your own image from the current directory
docker build -t fraud-api:1.0 .

# Run a container in detached mode
docker run -d --name fraud-api -p 8000:8000 fraud-api:1.0

# Inspect running containers
docker ps

# Read logs
docker logs fraud-api

# Open a shell in the container
docker exec -it fraud-api sh

# Stop and remove
docker stop fraud-api
docker rm fraud-api</code></pre>
<p><strong>Operationally, <code>docker exec</code> and <code>docker logs</code> are the commands you reach for first during debugging.</strong> They tell you whether the process started, whether the app crashed, whether it bound the expected port, and whether environment variables or files exist where you expect them.</p>
<p><strong>For data science systems, tagging matters.</strong> If you only use <code>latest</code>, you lose traceability. Use tags that map to application or model versions so you can roll back with confidence.</p>`,
    example:
      "A team building a recommendation API can tag images by both app and model release, such as `rec-api:2026-03-24` or `rec-api:model-v17`, making rollback and A/B evaluation safer.",
    animation: "DockerCommandWorkbench",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Which Docker commands do you use first when a containerized service is failing?",
        "Why is image tagging important for model-serving systems?",
        "What is the difference between `docker run` and `docker exec`?",
      ],
      [
        "I usually begin with `docker ps`, `docker logs`, and `docker inspect`. If the container is alive but misbehaving, I use `docker exec` to inspect files, environment variables, and the process state inside the running container.",
        "Tags turn an image into a traceable release artifact. In ML systems, that lets you map an API deployment to a specific code revision and model version, which is essential for rollback, evaluation, and incident analysis.",
        "`docker run` creates and starts a new container from an image. `docker exec` enters or runs a command inside an already running container.",
      ],
      "Senior answers should sound operational: mention logs, inspect, shell access, health checks, and why `latest` is not a sufficient release strategy."
    ),
    flashCards: buildFlashCards([
      ["Which command builds an image from a Dockerfile?", "`docker build`"],
      ["Which command shows running containers?", "`docker ps`"],
      ["Which command lets you inspect a live container from inside?", "`docker exec -it <name> sh` or `bash`"],
      ["Why avoid relying only on `latest`?", "It weakens traceability and makes rollback harder."],
    ]),
  }),
  makeNode({
    slug: "04-ports-env-and-troubleshooting",
    order: 4,
    title: "Ports, Environment Variables, and Troubleshooting",
    excerpt:
      "Map traffic correctly, inject configuration safely, and debug containers using logs, shell access, and runtime inspection.",
    theory: `<p><strong>A container can be healthy internally and still be unusable externally.</strong> That is why port mapping and runtime configuration matter so much. The transcript covers these as practical, failure-prone topics rather than abstract theory.</p>
<p><strong>Port mapping connects the host world to the container world.</strong> If your application listens on port 8000 inside the container, you often publish it to a host port using <code>-p host:container</code>. Without that mapping, the app may run but remain inaccessible from the browser, local tools, or other systems outside the container network.</p>
<p><strong>Environment variables externalize configuration.</strong> Instead of hardcoding secrets, database URLs, model paths, or stage-specific settings into the image, you inject them at runtime using <code>-e</code> flags or Compose configuration.</p>
<h3>Common Runtime Patterns</h3>
<pre><code># Publish a FastAPI model service
docker run -d --name scoring-api -p 8000:8000 scoring-api:1.0

# Inject environment variables
docker run -d --name trainer -e STAGE=dev -e MODEL_NAME=fraud_v3 trainer:1.0

# Stream logs
docker logs -f scoring-api

# Inspect networking and variables
docker inspect scoring-api</code></pre>
<h3>Troubleshooting Checklist</h3>
<ul>
  <li><strong>Is the process alive?</strong> Check <code>docker ps</code>.</li>
  <li><strong>Did the application crash on startup?</strong> Check <code>docker logs</code>.</li>
  <li><strong>Is the app listening on the port you exposed?</strong> Confirm the container-side port and host-side mapping.</li>
  <li><strong>Did configuration arrive correctly?</strong> Inspect environment variables and mounted files.</li>
  <li><strong>Is the failure actually downstream?</strong> The app may be healthy while the database or model artifact path is broken.</li>
</ul>
<p><strong>In data systems, configuration mistakes are common.</strong> The API may start, but fail only on first request because the model file path, feature-store URL, S3 credential, or database hostname is wrong. That is why image correctness and runtime correctness must both be checked.</p>
<blockquote>Container debugging is rarely magic. It is usually process, config, filesystem, network, or dependency state. Docker gives you commands to inspect each one.</blockquote>`,
    example:
      "A Jupyter image may start correctly inside the container, but unless port `8888` is published to the host and the token is configured correctly, users still cannot reach the notebook from the browser.",
    animation: "DockerCommandWorkbench",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "A container says it is running, but the API is unreachable. How do you debug it?",
        "Why should environment-specific settings usually stay out of the image?",
        "What runtime configuration examples appear often in ML platforms?",
      ],
      [
        "I check the published port mapping, verify the app is actually listening on the expected container port, inspect logs for startup failures, and confirm any upstream dependency such as the database or model path is reachable. Running is not the same as reachable.",
        "Because the same image should ideally move across environments. If configuration is baked into the image, you need a rebuild for every stage and risk leaking secrets or shipping the wrong settings.",
        "Common examples include model artifact location, experiment-tracking endpoint, feature-store URL, database credentials, cloud region, and service stage such as dev, staging, or production.",
      ],
      "The strongest answers distinguish between image build concerns and runtime configuration concerns. Mention ports, secrets, env vars, and dependency reachability."
    ),
    flashCards: buildFlashCards([
      ["What does `-p 8000:8000` mean?", "It maps host port 8000 to container port 8000."],
      ["What is a common use for `-e` in `docker run`?", "Passing environment variables such as config values or service URLs."],
      ["Which command is most useful for startup failures?", "`docker logs`"],
      ["Does a running container guarantee the app is reachable?", "No. Ports, process state, and upstream dependencies may still be wrong."],
    ]),
  }),
  makeNode({
    slug: "05-dockerfiles-and-layering",
    order: 5,
    title: "Dockerfiles, Custom Images, and Layer Caching",
    excerpt:
      "Turn your application into a reusable image and understand why Dockerfile order affects rebuild speed and maintainability.",
    theory: `<p><strong>A Dockerfile is the source code for an image.</strong> The transcript covers Dockerizing your own application because real teams do not only run public images; they define custom runtime environments for their own services.</p>
<p><strong>Each Dockerfile instruction creates a layer.</strong> Docker caches layers, so instruction order matters. Stable steps such as dependency installation should usually appear before frequently changing application source, otherwise every small code edit invalidates expensive build steps.</p>
<h3>Important Dockerfile Instructions</h3>
<ul>
  <li><strong><code>FROM</code>:</strong> selects the base image.</li>
  <li><strong><code>WORKDIR</code>:</strong> defines the working directory inside the image.</li>
  <li><strong><code>COPY</code>:</strong> moves files into the image.</li>
  <li><strong><code>RUN</code>:</strong> executes build-time commands such as package installation.</li>
  <li><strong><code>ENV</code>:</strong> sets default environment values.</li>
  <li><strong><code>EXPOSE</code>:</strong> documents the intended listening port.</li>
  <li><strong><code>CMD</code> or <code>ENTRYPOINT</code>:</strong> defines the runtime startup command.</li>
</ul>
<pre><code>FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]</code></pre>
<h3>Why Layering Matters</h3>
<ul>
  <li><strong>Cache efficiency:</strong> if <code>requirements.txt</code> is unchanged, Docker can reuse the dependency-install layer.</li>
  <li><strong>Smaller rebuild loops:</strong> changing one application file should not reinstall the whole runtime stack unnecessarily.</li>
  <li><strong>Cleaner production images:</strong> keep build tools out of the final runtime when possible.</li>
</ul>
<p><strong>For data science workloads, the base image choice is strategic.</strong> CPU-only inference, notebook experimentation, model training, and GPU serving may all need different bases. The principle stays the same: define the runtime explicitly, cache expensive steps intelligently, and avoid baking mutable secrets or large local datasets into the image.</p>
<p><strong>Production note:</strong> even if the transcript focuses on single-stage builds, you should know that multi-stage builds are a common extension. They let you separate build tooling from the final runtime artifact, which improves security and image size.</p>`,
    example:
      "For a model-serving FastAPI app, copying `requirements.txt` before the rest of the code prevents full dependency reinstalls every time you change one API route.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Why does Dockerfile instruction order affect build performance?",
        "What is the purpose of `CMD` in a Dockerfile?",
        "How would you Dockerize a data science inference service cleanly?",
      ],
      [
        "Because Docker caches build layers. If an early instruction changes, all later layers rebuild. So stable, expensive steps such as dependency installation should be placed before frequently changing source files when possible.",
        "`CMD` provides the default runtime command used when the container starts. It tells Docker what process should become the main container process unless overridden.",
        "I would choose a minimal but compatible base image, install only necessary system and Python dependencies, copy dependency manifests before source for better caching, expose the serving port, and keep secrets and environment-specific values out of the image.",
      ],
      "Senior answers talk about cache invalidation, image size, security, and build-runtime separation. In ML contexts, mention reproducibility and careful handling of large model artifacts."
    ),
    flashCards: buildFlashCards([
      ["What file defines how a custom image is built?", "A `Dockerfile`."],
      ["Why copy dependency manifests before source code?", "To preserve layer cache for expensive install steps."],
      ["What does `CMD` define?", "The default startup command for the container."],
      ["What does each Dockerfile instruction usually create?", "A build layer."],
    ]),
  }),
  makeNode({
    slug: "06-docker-compose",
    order: 6,
    title: "Docker Compose and Multi-Container Systems",
    excerpt:
      "Manage an application stack with multiple services, shared networks, persistent volumes, and declarative startup rules.",
    theory: `<p><strong>Single-container knowledge is not enough for real applications.</strong> The transcript moves from one service to coordinated systems, because most production apps involve at least an application container plus a database, cache, broker, or admin interface.</p>
<p><strong>Docker Compose lets you define a stack declaratively.</strong> Instead of writing long <code>docker run</code> commands repeatedly, you describe services, ports, environment variables, networks, and volumes in one file. Then you bring the stack up or down together.</p>
<pre><code>services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      MODEL_NAME: fraud_v3
      DB_HOST: postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:</code></pre>
<h3>Why Compose Is So Useful</h3>
<ul>
  <li><strong>Repeatability:</strong> teammates start the same stack with one command.</li>
  <li><strong>Shared service discovery:</strong> services can often reach one another by service name on the Compose network.</li>
  <li><strong>Centralized config:</strong> ports, env vars, volumes, and image sources are visible in one place.</li>
  <li><strong>Local-system simulation:</strong> useful for testing interactions before deploying to more advanced orchestrators.</li>
</ul>
<p><strong>In data platforms, Compose is often the fastest way to simulate a mini-production stack locally.</strong> You can run an API, a Postgres instance, an object-store emulator, a vector database, and a monitoring UI together without manually starting each dependency in the right order.</p>
<p><strong>Important nuance:</strong> Compose is excellent for local integration and smaller deployments, but not a full replacement for production orchestration platforms such as Kubernetes. Still, understanding Compose improves system thinking because it teaches you how services depend on one another.</p>`,
    example:
      "A local ML platform prototype might run `api`, `postgres`, `minio`, and `mlflow` as one Compose stack so the full workflow can be tested before cloud deployment.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Why use Docker Compose instead of many separate `docker run` commands?",
        "How do containers in a Compose stack usually talk to each other?",
        "Where is Compose especially helpful in data or AI projects?",
      ],
      [
        "Compose makes the stack declarative, versionable, and repeatable. It is easier to review, share, and run consistently than a long set of manual commands.",
        "Typically through the shared Compose network, often by using service names as hostnames. That makes local multi-service communication much simpler.",
        "It is especially useful for local integration of APIs, databases, experiment trackers, queues, vector stores, and admin tools so that engineers can validate the full workflow before a production rollout.",
      ],
      "Strong answers frame Compose as a collaboration and systems tool, not just a convenience wrapper. Mention service coordination, shared networks, and local integration testing."
    ),
    flashCards: buildFlashCards([
      ["What problem does Docker Compose solve?", "It manages multi-container applications declaratively."],
      ["What command usually starts a Compose stack?", "`docker compose up`"],
      ["How can one service often reach another in Compose?", "By using the service name over the shared network."],
      ["Why is Compose good for ML platform prototyping?", "It lets multiple dependent services run together reproducibly on one machine."],
    ]),
  }),
  makeNode({
    slug: "07-volumes-and-persistent-storage",
    order: 7,
    title: "Volumes, Bind Mounts, and Persistent Data",
    excerpt:
      "Persist state beyond the container lifecycle and choose correctly between named volumes, anonymous volumes, and bind mounts.",
    theory: `<p><strong>Containers are disposable by design; state usually is not.</strong> If you delete a container, its writable runtime layer disappears with it. That is why storage strategy matters for databases, uploaded files, experiment outputs, and iterative development workflows.</p>
<p><strong>The transcript distinguishes three common patterns.</strong> Named volumes are managed by Docker and are the usual choice for persistent application state. Anonymous volumes are Docker-managed but not explicitly named, which makes them more temporary and easier to accumulate accidentally. Bind mounts map a host directory directly into the container, which is especially useful in development.</p>
<h3>Storage Choices</h3>
<ul>
  <li><strong>Named volume:</strong> explicit, reusable, good for database data and durable container-managed state.</li>
  <li><strong>Anonymous volume:</strong> Docker-managed but unnamed, often used for temporary or less intentionally managed persistence.</li>
  <li><strong>Bind mount:</strong> host path mounted into the container, ideal for live code editing or controlled host-file access.</li>
</ul>
<pre><code># Named volume
docker run -d -v pgdata:/var/lib/postgresql/data postgres:16

# Anonymous volume
docker run -d -v /app/cache my-image:1.0

# Bind mount
docker run -it -v $(pwd):/app node:20 sh</code></pre>
<p><strong>Choose based on ownership.</strong> If Docker should manage the lifecycle of the storage, prefer named volumes. If the host filesystem should remain the source of truth, use a bind mount. For local development, bind mounts are often the fastest way to edit code without rebuilding the image every time.</p>
<p><strong>In data science work, be very deliberate.</strong> Mounting raw datasets, notebooks, model checkpoints, or experiment outputs is common, but you should avoid accidentally coupling local host paths too tightly to production images. Development convenience and deployment discipline are not the same thing.</p>
<blockquote>Images define software. Volumes define state. Mixing those responsibilities carelessly creates brittle systems.</blockquote>`,
    example:
      "A Postgres container should store its database files in a named volume, while a notebook development container may use a bind mount so changes to `.ipynb` files appear instantly on the host.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "When would you choose a named volume instead of a bind mount?",
        "Why is container persistence a separate concern from image building?",
        "What are good and bad uses of bind mounts in data projects?",
      ],
      [
        "I choose a named volume when Docker should manage durable state such as a database directory. It is cleaner and less tied to one developer machine than a host-path bind mount.",
        "Because images are meant to be reproducible software artifacts, while persistent state changes over time. Databases, checkpoints, and uploaded files should survive container restarts without being baked into the image.",
        "Bind mounts are great for local source code, notebooks, and controlled data access during development. They are a poor default for production persistence because they tie container behavior too tightly to a specific host filesystem layout.",
      ],
      "Senior answers clearly separate immutable image design from mutable data design. Mention durability, portability, and operational ownership."
    ),
    flashCards: buildFlashCards([
      ["Why do volumes exist?", "To persist data outside the disposable container writable layer."],
      ["What is the usual durable default for database data?", "A named volume."],
      ["When are bind mounts especially useful?", "During development, when host files should appear directly inside the container."],
      ["Why should state not usually be baked into images?", "Because images should stay immutable and reproducible, while state changes over time."],
    ]),
  }),
  makeNode({
    slug: "08-networking-and-custom-networks",
    order: 8,
    title: "Docker Networking and Custom Bridges",
    excerpt:
      "Understand how containers communicate with each other, the host machine, and the outside world through Docker network drivers.",
    theory: `<p><strong>Docker networking answers one practical question:</strong> who can talk to whom, and through which path? The transcript covers both the default behavior and custom bridge networks because multi-container communication breaks down quickly if the network model is fuzzy.</p>
<p><strong>Bridge networking is the default and the most common mode.</strong> Containers on the same bridge network can communicate with each other, while published ports expose selected services to the host or outside clients. Docker can also create custom bridge networks, which are often better for application stacks because they provide cleaner isolation and easier service-to-service communication.</p>
<h3>Main Network Driver Types</h3>
<ul>
  <li><strong>Bridge:</strong> default choice for most container-to-container communication on one host.</li>
  <li><strong>Host:</strong> container uses the host network namespace directly, reducing isolation.</li>
  <li><strong>None:</strong> container gets no external network connectivity.</li>
</ul>
<pre><code># List networks
docker network ls

# Create a custom bridge
docker network create my-app-net

# Run containers on that network
docker run -d --name api --network my-app-net api:1.0
docker run -d --name postgres --network my-app-net postgres:16</code></pre>
<p><strong>Custom bridge networks are often preferable to the default bridge.</strong> They make it easier to keep related services together and reason about who should be able to communicate. In many local stacks, this is what allows an API container to reach a database container by name rather than by host-specific hacks.</p>
<p><strong>For AI systems, networking shows up everywhere.</strong> A notebook may need to call an API. The API may need to reach Postgres, Redis, or a vector store. A model-serving service may need access to an object store or telemetry sink. Networking is the connective tissue of the whole stack.</p>
<h3>Useful Mental Model</h3>
<ul>
  <li><strong>Container -> container:</strong> usually via a shared Docker network.</li>
  <li><strong>Host -> container:</strong> usually via published ports.</li>
  <li><strong>Container -> internet or external systems:</strong> controlled by Docker networking plus the host environment.</li>
</ul>`,
    example:
      "A retrieval system may run an embedding API, Postgres, and a vector database in separate containers on one custom bridge network so each service can talk to the others by name.",
    animation: "DockerArchitectureViz",
    tool: "DockerCommandWorkbench",
    interviewPrep: buildInterviewPrep(
      [
        "Why are custom bridge networks often better than relying on the default bridge?",
        "What is the role of port publishing if containers can already talk on a bridge network?",
        "How would you explain `bridge`, `host`, and `none` in plain language?",
      ],
      [
        "Custom bridge networks give you cleaner grouping and clearer application-level isolation. They make multi-service communication easier to reason about and reduce accidental coupling with unrelated containers.",
        "Bridge networking handles container-to-container communication, but port publishing controls whether the host or outside world can reach a service. Internal reachability and external exposure are separate concerns.",
        "Bridge means normal isolated container networking with controlled communication. Host means the container shares the host's network stack directly. None means the container is isolated from networking entirely.",
      ],
      "A strong answer separates internal service discovery from external exposure. That distinction is central in real platform and MLOps design."
    ),
    flashCards: buildFlashCards([
      ["What is the default common Docker network driver?", "Bridge."],
      ["Why create a custom bridge network?", "To group related containers and simplify service-to-service communication."],
      ["What does host networking do?", "It lets the container use the host network stack directly."],
      ["What does the `none` driver imply?", "The container has no network connectivity."],
    ]),
  }),
  makeNode({
    slug: "09-cheat-sheet-and-revision",
    order: 9,
    title: "Docker Cheat Sheet and Revision Guide",
    excerpt:
      "Use the embedded PDF cheat sheet, download the original reference, and revise the full Docker workflow from image build to multi-container deployment.",
    theory: `<p><strong>This final section turns the lecture into a fast-revision surface.</strong> You now have both the expanded English notes and the original PDF cheat sheet available inside Concept Lab.</p>
<p><strong>Open or download the cheat sheet here:</strong> <a href="${CHEAT_SHEET_URL}" target="_blank" rel="noreferrer">Docker Cheat Sheet PDF</a>.</p>
<p><strong>What to revise before an interview or project sprint:</strong></p>
<ul>
  <li><strong>Foundations:</strong> why Docker exists, image vs container, container vs VM.</li>
  <li><strong>Execution:</strong> build, pull, run, inspect, logs, exec, stop, remove.</li>
  <li><strong>Packaging:</strong> Dockerfiles, layering, caching, tagging, registries.</li>
  <li><strong>System design:</strong> Compose, volumes, networks, service communication.</li>
  <li><strong>Operational mindset:</strong> debug via process, config, storage, and connectivity rather than guessing.</li>
</ul>
<h3>Data Science Project Framing</h3>
<p>If you are using Docker in data science or AI engineering, you should be able to explain at least one end-to-end case such as this:</p>
<pre><code>notebook / training job -> packaged image -> validated container ->
Compose stack for local integration -> pushed image ->
model-serving API deployment with versioned rollback path</code></pre>
<p><strong>That is the real value of Docker:</strong> it turns runtime assumptions into versioned engineering assets.</p>
<p><strong>Cheat sheet usage tip:</strong> use the PDF for command recall, and use the topic pages in this Docker section for deeper reasoning, tradeoffs, and architectural understanding.</p>`,
    example:
      "Before shipping a new inference service, a team can rehearse the whole path locally: build the image, run the API, connect it to a database through Compose, mount persistent state if needed, and then promote the same image tag to a registry.",
    animation: "DockerCheatSheetPanel",
    tool: "DockerCheatSheetPanel",
    interviewPrep: buildInterviewPrep(
      [
        "How would you describe Docker's value in one end-to-end MLOps story?",
        "What should you verify before promoting a locally tested image toward production?",
        "How do Docker, Compose, volumes, and networks fit together in one system design explanation?",
      ],
      [
        "I would explain Docker as the mechanism that standardizes the runtime from development to deployment. In MLOps, it helps package training or inference services, keep dependencies reproducible, and make the deployed artifact traceable and repeatable.",
        "I would verify the image tag, runtime configuration, exposed ports, dependency connectivity, mounted state, startup command, and whether the service behaves correctly when running from the built image rather than from my local host environment.",
        "Docker provides the image and container runtime. Compose coordinates multiple services. Volumes persist state outside containers. Networks define how services communicate internally and externally. Together they create a reproducible, multi-service application environment.",
      ],
      "Senior answers combine packaging, operations, and system design into one narrative. That is exactly what many platform, ML, and AI engineering interviews are looking for."
    ),
    flashCards: buildFlashCards([
      ["Where is the embedded Docker PDF available in this project?", "At `/cheatsheets/docker-cheat-sheet.pdf`, linked from the Docker cheat-sheet topic page."],
      ["What should you revise first before an interview?", "Image vs container, Dockerfile basics, core commands, volumes, Compose, and networking."],
      ["What makes a Docker image promotion safe?", "Versioned tags, reproducible configuration, verified dependencies, and a clear rollback path."],
      ["What is the big-picture value of Docker?", "It turns runtime assumptions into portable, versioned engineering assets."],
    ]),
  }),
];
