const requiredLabelPrefixes = {
   A: 'Area',
   D: 'Difficulty',
   P: 'Priority',
   S: 'Status',
   T: 'Type',
};

// Fetch current labels
const {
   data: { labels },
} = await github.rest.issues.listLabelsOnIssue({
   owner,
   repo,
   issue_number: number,
});

let hasArea = false;
let hasDifficulty = false;
let hasPriority = false;
let hasStatus = false;
let hasType = false;

for (const label of labels) {
   if (label.name.startsWith('A')) {
      hasArea = true;
   } else if (label.name.startsWith('D')) {
      hasDifficulty = true;
   } else if (label.name.startsWith('P')) {
      hasPriority = true;
   } else if (label.name.startsWith('S')) {
      hasStatus = true;
   } else if (label.name.startsWith('T')) {
      hasType = true;
   }
}

let comment =
   'Hey there! It looks like this issue is missing some important labels: ';
if (!hasArea) {
   comment += 'Area, ';
}
if (!hasDifficulty) {
   comment += 'Difficulty, ';
}
if (!hasPriority) {
   comment += 'Priority, ';
}
if (!hasStatus) {
   comment += 'Status, ';
}
if (!hasType) {
   comment += 'Type, ';
}

if (!comment.endsWith('. ')) {
    comment = comment.slice(0, -2);
    comment += ". ";
}

comment += "Please add these labels to the issue so we can better track it. Thanks!";

await github.rest.issues.createComment({
   owner,
   repo,
   issue_number: number,
   body: commentBody,
});
