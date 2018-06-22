var userName = document.querySelector('.git-user-name'),
    submitUserName = document.querySelector('.git-submit-button'),
    gitRepoList = document.querySelector('.user-git-repo-list'),
    gitIssueTitle = document.querySelector('#git-create-issue-title'),
    gitIssueBody = document.querySelector('#git-create-issue-body'),
    gitCreateIssue = document.querySelector('.git-create-issue-form-submit');
userName.addEventListener('blur', function (ev) {
    if (userName.value === '') {
        submitUserName.disabled = true;
    } else {
        submitUserName.disabled = false;
    }
});
gitIssueTitle.addEventListener('blur', function (ev) {
    if (gitIssueTitle.value === '') {
        gitCreateIssue.disabled = true;
    } else {
        gitCreateIssue.disabled = false;
    }
})
submitUserName.addEventListener('click', function (ev) {
    var url = 'https://api.github.com/users/' + userName.value + '/repos';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            _getTemplate(json);
        }).catch((e) => { console.log('user not found'); });

});
_getTemplate = function (json) {
    var template = document.querySelector('.user-git-repo-list-template').innerHTML,
        str = '',
        templateList;

    json.forEach(element => {
        templateList = template.replace('$$giturl', element.url).replace('$$reponame', element.name);
        str += templateList;
        gitRepoList.innerHTML = str;
    });

}

gitRepoList.addEventListener('click', function (ev) {
    if (ev.target.tagName.toLowerCase() === 'a') {
        repoName = $(ev.target).parents('li').find('span').attr('repo-name');
    }
});

gitCreateIssue.addEventListener('click', function (ev) {
    var accessToken = '78e92ddda91460b912d0abe3aefaf85fa8bc302a',
        url = 'https://api.github.com/repos/' + userName.value + '/' + repoName + '/issues',
        issueTitle = gitIssueTitle.value,
        issueBody = gitIssueBody.value;
    //setTimeout(500);
    createIssue(url, issueTitle, issueBody, accessToken);

});
createIssue = function (url, issueTitle, issueBody, accessToken) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'token ' + accessToken,
            'Accept': 'application/vnd.github.symmetra-preview+json'
        },
        body: JSON.stringify({
            title: issueTitle,
            body: issueBody
        })
    }).then((res) => res.json())
        .then((data) => $('.git-issue-created').show())
        .catch((err) => $('.git-issue-failed').show());
}