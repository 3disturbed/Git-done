// Script By: 3Disturbed (Ben Darlington)
// Last Updated: 2024-10-26
// Description: This script handles the logic for the Git-done Wizard application.
let selectedAction = "";
let selectedError = "";
let step = 1;
// Function to update the progress indicator
function updateProgress(stepNumber) {
    for (let i = 1; i <= 3; i++) {
        const progressElement = document.getElementById(`progress-${i}`);
        if (i <= stepNumber) {
            progressElement.classList.add('active');
        } else {
            progressElement.classList.remove('active');
        }
    }
}

// Function to handle action selection
function selectAction(action) {
    selectedAction = action;
    goToStep(2);
}

// Function to handle error selection
function selectError(error) {
    selectedError = error;
    goToStep(3);
}

// Function to navigate between steps
function goToStep(stepNumber) {
    step = stepNumber;
    // Hide all steps
    const steps = document.querySelectorAll('.container');
    steps.forEach(step => step.classList.remove('active'));

    // Show the selected step
    document.getElementById(`step-${stepNumber}`).classList.add('active');

    // Update progress indicator
    updateProgress(stepNumber);

    // If the final step, find the solution
    if (stepNumber === 3) {
        findSolution();
    }
}

// Function to reset the wizard
function startOver() {
    selectedAction = "";
    selectedError = "";
    document.getElementById("solution").innerHTML = "";
    goToStep(1);
}

// Function to find and display the solution
function findSolution() {
    const solutionBox = document.getElementById("solution");

    let solution = "";

    switch (selectedAction) {
        case "clone":
            if (selectedError === "authentication") {
                solution = `
                    <h3>Authentication Issues While Cloning</h3>
                    <p><strong>Explanation:</strong> Authentication errors occur when Git cannot verify your identity or access rights.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Check Credentials:</strong> Ensure that your username and password are correct. If using a token, verify that it hasn't expired.</li>
                        <li><strong>Use SSH:</strong> Set up SSH keys for secure authentication without passwords. This involves generating an SSH key pair and adding the public key to your Git hosting service.</li>
                    </ul>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Using SSH keys enhances security and simplifies authentication by eliminating the need to enter your credentials repeatedly.</p>
                    </div>
                    <h4>Helpful Commands:</h4>
                    <pre><code>
# Generate SSH Key
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# Add SSH Key to SSH Agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

# Copy SSH Key to Clipboard
# For macOS:
pbcopy < ~/.ssh/id_rsa.pub
# For Linux:
xclip -sel clip < ~/.ssh/id_rsa.pub

# Then add the SSH key to your Git hosting service account.
                    </code></pre>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Cloning a Repository</h3>
                    <p><strong>Explanation:</strong> Cloning creates a local copy of a remote repository on your machine.</p>
                    <h4>Steps to Follow:</h4>
                    <ol>
                        <li><strong>Copy Repository URL:</strong> Obtain the HTTPS or SSH URL from your repository hosting service.</li>
                        <li><strong>Run Clone Command:</strong> Use the command below in your terminal.</li>
                    </ol>
                    <h4>Command:</h4>
                    <pre><code>git clone &lt;repository_url&gt;</code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can clone a specific branch by adding the <code>-b &lt;branch_name&gt;</code> option: <code>git clone -b &lt;branch_name&gt; &lt;repository_url&gt;</code>.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Cloning Repository</h3>
                    <p><strong>Explanation:</strong> Various issues can prevent cloning, such as incorrect URLs or lack of permissions.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Verify Repository URL:</strong> Ensure the URL is correct and accessible.</li>
                        <li><strong>Check Permissions:</strong> Confirm that you have the necessary access rights to the repository.</li>
                    </ul>
                `;
            }
            break;

        case "init":
            if (selectedError === "no error") {
                solution = `
                    <h3>Initializing a Repository</h3>
                    <p><strong>Explanation:</strong> Initializing a repository sets up the necessary Git structures in a new or existing project directory.</p>
                    <h4>Steps to Follow:</h4>
                    <ol>
                        <li><strong>Navigate to Your Project Directory:</strong> Use <code>cd &lt;project_directory&gt;</code>.</li>
                        <li><strong>Initialize Git:</strong> Run <code>git init</code> to create a new Git repository.</li>
                        <li><strong>Add Files:</strong> Stage your files with <code>git add .</code>.</li>
                        <li><strong>Make Initial Commit:</strong> Commit your files with <code>git commit -m "Initial commit"</code>.</li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>The <code>git init</code> command can be used to reinitialize an existing repository if needed.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Initializing a Repository</h3>
                    <p><strong>Possible Solutions:</strong> Ensure you have the necessary permissions to create files in the directory. Check for existing Git repositories that might conflict.</p>
                `;
            }
            break;

        case "commit":
            if (selectedError === "nothing to commit") {
                solution = `
                    <h3>"Nothing to Commit" Error</h3>
                    <p><strong>Explanation:</strong> This error means there are no staged changes to commit.</p>
                    <h4>Steps to Resolve:</h4>
                    <ol>
                        <li><strong>Check Status:</strong> Run <code>git status</code> to see untracked or modified files.</li>
                        <li><strong>Stage Changes:</strong> Add files to the staging area using <code>git add &lt;file_name&gt;</code> or <code>git add .</code></li>
                        <li><strong>Commit:</strong> Once staged, commit your changes with a meaningful message.</li>
                    </ol>
                    <h4>Commands:</h4>
                    <pre><code>
git add .
git commit -m "Your descriptive commit message"
                    </code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Using <code>git commit -am "message"</code> stages and commits tracked files in one step.</p>
                    </div>
                `;
            } else if (selectedError === "detached head") {
                solution = `
                    <h3>Detached HEAD State</h3>
                    <p><strong>Explanation:</strong> You're in a detached HEAD state when HEAD points directly to a commit rather than a branch.</p>
                    <h4>Steps to Resolve:</h4>
                    <ul>
                        <li><strong>Create a New Branch:</strong> If you want to keep the changes, create a new branch: <code>git checkout -b &lt;new_branch_name&gt;</code></li>
                        <li><strong>Switch to a Branch:</strong> To discard changes, switch back to an existing branch: <code>git checkout &lt;branch_name&gt;</code></li>
                    </ul>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>The detached HEAD state is useful when you want to check out a specific commit without affecting any branches.</p>
                    </div>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Committing Changes</h3>
                    <p><strong>Explanation:</strong> Committing saves your staged changes to the repository's history.</p>
                    <h4>Steps to Follow:</h4>
                    <ol>
                        <li><strong>Stage Changes:</strong> Use <code>git add &lt;file_name&gt;</code> or <code>git add .</code></li>
                        <li><strong>Commit:</strong> Use <code>git commit -m "Your commit message"</code></li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Commit messages should be concise but descriptive, explaining what changes were made and why.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues with Committing Changes</h3>
                    <p><strong>Possible Solutions:</strong></p>
                    <ul>
                        <li><strong>Configure User Information:</strong> Set your name and email if Git prompts for them.</li>
                        <li><strong>Resolve Merge Conflicts:</strong> If a merge conflict exists, resolve it before committing.</li>
                    </ul>
                    <h4>Commands:</h4>
                    <pre><code>
# Set User Name and Email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
                    </code></pre>
                `;
            }
            break;

        case "push":
            if (selectedError === "rejected") {
                solution = `
                    <h3>"Push Rejected" Error</h3>
                    <p><strong>Explanation:</strong> This happens when your local branch is behind the remote branch.</p>
                    <h4>Steps to Resolve:</h4>
                    <ol>
                        <li><strong>Pull Changes:</strong> Use <code>git pull origin &lt;branch_name&gt;</code> to update your local branch.</li>
                        <li><strong>Resolve Conflicts:</strong> If conflicts arise, resolve them in your code editor.</li>
                        <li><strong>Commit Merges:</strong> After resolving, commit the changes.</li>
                        <li><strong>Push Again:</strong> Attempt to push your changes with <code>git push origin &lt;branch_name&gt;</code></li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can set up Git to rebase during pulls to maintain a linear history: <code>git config --global pull.rebase true</code></p>
                    </div>
                `;
            } else if (selectedError === "not permitted") {
                solution = `
                    <h3>Permission Issues When Pushing</h3>
                    <p><strong>Explanation:</strong> This occurs when you don't have write access to the repository.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Check Access Rights:</strong> Ensure you have the necessary permissions on the remote repository.</li>
                        <li><strong>Authenticate Properly:</strong> Verify your credentials or SSH key setup.</li>
                    </ul>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>If you're contributing to someone else's repository, you might need to fork it and submit a pull request.</p>
                    </div>
                `;
            } else if (selectedError === "ssl") {
                solution = `
                    <h3>SSL Certificate Problems</h3>
                    <p><strong>Explanation:</strong> SSL errors occur due to issues with SSL certificate validation.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Update Git:</strong> Ensure you're using the latest version of Git, which may have updated certificates.</li>
                        <li><strong>Configure SSL Verification:</strong> As a last resort, you can disable SSL verification (not recommended for security reasons): <code>git config --global http.sslVerify false</code></li>
                    </ul>
                    <div class="tip">
                        <h4>Warning!</h4>
                        <p>Disabling SSL verification can expose you to man-in-the-middle attacks. Use with caution and only temporarily.</p>
                    </div>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Pushing Changes to Remote Repository</h3>
                    <p><strong>Explanation:</strong> Pushing sends your committed changes to the remote repository.</p>
                    <h4>Command:</h4>
                    <pre><code>git push origin &lt;branch_name&gt;</code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can set the upstream branch to simplify future pushes: <code>git push -u origin &lt;branch_name&gt;</code></p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Pushing Changes</h3>
                    <p><strong>Possible Solutions:</strong> Ensure you have network connectivity, correct remote URLs, and necessary permissions.</p>
                `;
            }
            break;

        case "pull":
            if (selectedError === "conflict") {
                solution = `
                    <h3>Merge Conflicts During Pull</h3>
                    <p><strong>Explanation:</strong> Conflicts occur when the same lines of code have been changed in both local and remote branches.</p>
                    <h4>Steps to Resolve:</h4>
                    <ol>
                        <li><strong>Identify Conflicts:</strong> Use <code>git status</code> to see conflicting files.</li>
                        <li><strong>Resolve Conflicts:</strong> Open conflicting files and decide which changes to keep.</li>
                        <li><strong>Mark as Resolved:</strong> After editing, add the files with <code>git add &lt;file_name&gt;</code></li>
                        <li><strong>Commit Changes:</strong> Finalize the merge with <code>git commit</code></li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Using a graphical merge tool like <code>git mergetool</code> can simplify conflict resolution.</p>
                    </div>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Pulling Changes from Remote Repository</h3>
                    <p><strong>Explanation:</strong> Pulling updates your local repository with changes from the remote.</p>
                    <h4>Command:</h4>
                    <pre><code>git pull origin &lt;branch_name&gt;</code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can use <code>git fetch</code> followed by <code>git merge</code> for more control over the update process.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Pulling Changes</h3>
                    <p><strong>Possible Solutions:</strong> Check your network connection, remote repository accessibility, and resolve any existing conflicts in your local repository.</p>
                `;
            }
            break;

        case "branch":
            if (selectedError === "already exists") {
                solution = `
                    <h3>Branch Already Exists</h3>
                    <p><strong>Explanation:</strong> You're attempting to create a branch that already exists locally or remotely.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Use a Different Name:</strong> Choose a unique branch name.</li>
                        <li><strong>Checkout Existing Branch:</strong> Switch to the existing branch using <code>git checkout &lt;branch_name&gt;</code></li>
                    </ul>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can list all branches with <code>git branch -a</code> to see both local and remote branches.</p>
                    </div>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Managing Branches</h3>
                    <p><strong>Explanation:</strong> Branching allows you to work on different versions of your code simultaneously.</p>
                    <h4>Common Commands:</h4>
                    <pre><code>
# List branches
git branch

# Create a new branch
git branch &lt;new_branch_name&gt;

# Switch to a branch
git checkout &lt;branch_name&gt;

# Create and switch to a new branch
git checkout -b &lt;new_branch_name&gt;
                    </code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Branches are lightweight pointers to commits. Deleting a branch doesn't delete the commits themselves.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Managing Branches</h3>
                    <p><strong>Possible Solutions:</strong> Ensure branch names are correct and check for any typos. Verify your repository's integrity if unexpected behavior occurs.</p>
                `;
            }
            break;

        case "merge":
            if (selectedError === "conflict") {
                solution = `
                    <h3>Merge Conflicts</h3>
                    <p><strong>Explanation:</strong> Conflicts occur when Git cannot automatically reconcile differences in code between branches.</p>
                    <h4>Steps to Resolve:</h4>
                    <ol>
                        <li><strong>Identify Conflicts:</strong> Run <code>git status</code> to see conflicting files.</li>
                        <li><strong>Resolve Conflicts:</strong> Manually edit the files to resolve conflicts.</li>
                        <li><strong>Add Files:</strong> Stage the resolved files with <code>git add &lt;file_name&gt;</code></li>
                        <li><strong>Commit Merge:</strong> Complete the merge with <code>git commit</code></li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can abort a merge with <code>git merge --abort</code> if you want to return to the state before the merge started.</p>
                    </div>
                `;
            } else if (selectedError === "merge failed") {
                solution = `
                    <h3>Merge Failed</h3>
                    <p><strong>Explanation:</strong> The merge operation failed due to conflicts or other issues.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Resolve Conflicts:</strong> Identify and resolve any merge conflicts.</li>
                        <li><strong>Check Branches:</strong> Ensure you are merging the correct branches.</li>
                        <li><strong>Abort Merge:</strong> If needed, abort the merge with <code>git merge --abort</code></li>
                    </ul>
                `;
            } else if (selectedError === "cannot fast-forward") {
                solution = `
                    <h3>Cannot Fast-Forward</h3>
                    <p><strong>Explanation:</strong> A fast-forward merge isn't possible due to diverging branches.</p>
                    <h4>Possible Solutions:</h4>
                    <ul>
                        <li><strong>Perform a Merge Commit:</strong> Use <code>git merge --no-ff &lt;branch_name&gt;</code> to create a merge commit.</li>
                        <li><strong>Rebase Instead:</strong> Consider rebasing your changes onto the target branch: <code>git rebase &lt;branch_name&gt;</code></li>
                    </ul>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Merging Branches</h3>
                    <p><strong>Explanation:</strong> Merging integrates changes from one branch into another.</p>
                    <h4>Steps to Merge:</h4>
                    <ol>
                        <li><strong>Switch Branches:</strong> Checkout the branch you want to merge into.</li>
                        <li><strong>Merge:</strong> Use <code>git merge &lt;source_branch&gt;</code> to merge the source branch into the current branch.</li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can use <code>git log --graph --oneline</code> to visualize your branch history and merges.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Merging Branches</h3>
                    <p><strong>Possible Solutions:</strong> Check for uncommitted changes or conflicts, and ensure you're merging the correct branches.</p>
                `;
            }
            break;

        case "rebase":
            if (selectedError === "conflict") {
                solution = `
                    <h3>Rebase Conflicts</h3>
                    <p><strong>Explanation:</strong> Conflicts during rebasing happen for the same reasons as merge conflicts.</p>
                    <h4>Steps to Resolve:</h4>
                    <ol>
                        <li><strong>Resolve Conflicts:</strong> Fix conflicts in files and stage them with <code>git add &lt;file_name&gt;</code></li>
                        <li><strong>Continue Rebase:</strong> Run <code>git rebase --continue</code></li>
                        <li><strong>Abort Rebase:</strong> If needed, abort with <code>git rebase --abort</code></li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Rebasing rewrites history. Be cautious when rebasing shared branches.</p>
                    </div>
                `;
            } else if (selectedError === "no error") {
                solution = `
                    <h3>Rebasing Branches</h3>
                    <p><strong>Explanation:</strong> Rebasing moves your branch to a new base commit.</p>
                    <h4>Steps to Rebase:</h4>
                    <ol>
                        <li><strong>Switch Branches:</strong> Checkout the branch you want to rebase.</li>
                        <li><strong>Rebase:</strong> Use <code>git rebase &lt;base_branch&gt;</code> to rebase onto the base branch.</li>
                    </ol>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Interactive rebasing (<code>git rebase -i</code>) lets you edit, reorder, or squash commits.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Rebasing Branches</h3>
                    <p><strong>Possible Solutions:</strong> Ensure your working directory is clean before rebasing. Resolve any conflicts that arise during the rebase process.</p>
                `;
            }
            break;

        case "stash":
            if (selectedError === "no error") {
                solution = `
                    <h3>Stashing Changes</h3>
                    <p><strong>Explanation:</strong> Stashing temporarily saves your uncommitted changes.</p>
                    <h4>Common Commands:</h4>
                    <pre><code>
# Stash changes
git stash

# List stashes
git stash list

# Apply the latest stash
git stash apply

# Apply and remove the latest stash
git stash pop

# Apply a specific stash
git stash apply stash@{n}

# Drop a specific stash
git stash drop stash@{n}
                    </code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can stash untracked files with <code>git stash -u</code>, or include ignored files with <code>git stash -a</code>.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Stashing Changes</h3>
                    <p><strong>Possible Solutions:</strong> Ensure you don't have merge conflicts. Check if your stash list is empty or if you've already applied the stash.</p>
                `;
            }
            break;

        case "reset":
            if (selectedError === "no error") {
                solution = `
                    <h3>Undoing Changes</h3>
                    <p><strong>Explanation:</strong> Git provides several commands to undo changes at different stages.</p>
                    <h4>Common Commands:</h4>
                    <pre><code>
# Unstage files (move from staging area back to working directory)
git reset &lt;file_name&gt;

# Discard changes in working directory (to last commit)
git checkout -- &lt;file_name&gt;

# Reset to a previous commit (soft reset, keeps changes in working directory)
git reset --soft &lt;commit_hash&gt;

# Reset to a previous commit (hard reset, discards changes)
git reset --hard &lt;commit_hash&gt;
                    </code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>Using <code>git reflog</code>, you can find recent commits and recover lost work after a reset.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Undoing Changes</h3>
                    <p><strong>Possible Solutions:</strong> Be cautious with hard resets as they can permanently delete uncommitted changes. Always ensure you have backups or have pushed important commits to a remote repository.</p>
                `;
            }
            break;

        case "log":
            if (selectedError === "no error") {
                solution = `
                    <h3>Viewing History</h3>
                    <p><strong>Explanation:</strong> Git allows you to view the history of commits and changes.</p>
                    <h4>Common Commands:</h4>
                    <pre><code>
# View commit history
git log

# View a concise history
git log --oneline

# View changes between commits
git diff &lt;commit1&gt; &lt;commit2&gt;

# View changes in a specific file over time
git log -p &lt;file_name&gt;
                    </code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can visualize the commit history as a graph using <code>git log --graph --oneline --all</code>.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Viewing History</h3>
                    <p><strong>Possible Solutions:</strong> Ensure you're in a Git repository directory. If the history is missing, check if the repository was cloned correctly.</p>
                `;
            }
            break;

        case "remote":
            if (selectedError === "no error") {
                solution = `
                    <h3>Managing Remote Repositories</h3>
                    <p><strong>Explanation:</strong> Remotes are versions of your project that are hosted on the internet or network.</p>
                    <h4>Common Commands:</h4>
                    <pre><code>
# Add a remote repository
git remote add origin &lt;repository_url&gt;

# List remote repositories
git remote -v

# Remove a remote
git remote remove &lt;name&gt;

# Rename a remote
git remote rename &lt;old_name&gt; &lt;new_name&gt;
                    </code></pre>
                    <div class="tip">
                        <h4>Did You Know?</h4>
                        <p>You can fetch changes from all remotes using <code>git fetch --all</code>.</p>
                    </div>
                `;
            } else {
                solution = `
                    <h3>Issues Managing Remotes</h3>
                    <p><strong>Possible Solutions:</strong> Verify the remote URLs and ensure you have network connectivity. Authentication issues may require you to update your credentials or SSH keys.</p>
                `;
            }
            break;

        default:
            solution = `<p><strong>Solution:</strong> Please select an action and an error to get help.</p>`;
    }

    // Display the solution
    solutionBox.innerHTML = solution;
}
