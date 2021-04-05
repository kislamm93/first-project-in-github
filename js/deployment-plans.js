let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let deploymentPlansDefault = [];

loadJSON('data.json',
    function (data) {
        console.log(data);
        deploymentPlansDefault = data.deploymentPlans;
        buildDeploymentPlans(deploymentPlansDefault);
    },
    function (xhr) {
        console.error(xhr);
    }
);

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function buildDeploymentPlans(deploymentPlansDefault) {
    const deploymentPlansWrapper = document.getElementById('deployment-plans-wrapper');
    const deploymentPlans = deploymentPlansDefault.map((plan, planIndex) => {
        const deployments = plan.deployments.map((deployment, deploymentIndex) => {
            let affectedSoftComps = [];
            for (const log of deployment.device.actionLog) {
                if (log.action === 'install') {
                    affectedSoftComps.push(log.affectedSoftwareComponent.externalId);
                }
            }
            affectedSoftComps = [...new Set(affectedSoftComps)];

            const softwareComponents = deployment.softwareComponents.map(softwareComponent => {
                let status = '';
                if (affectedSoftComps.includes(softwareComponent.externalId)) {
                    status = 'checked disabled';
                }

                return getSoftwareComponentHTML(softwareComponent, status, planIndex, deploymentIndex);
            });

            return getDeploymentHTML(deployment, softwareComponents);
        });

        return getPlanHTML(plan, deployments);
    });

    deploymentPlansWrapper.insertAdjacentHTML('beforeend', deploymentPlans.join(''));
}

function installComponent(component, planIndex, deploymentIndex) {
    console.log(component.externalId);
    console.log(deploymentPlansDefault);
    const deploymentPlans = [...deploymentPlansDefault];
    console.log(deploymentPlans);
    // ### NEED TO DO ### modify deploymentPlans using the parameters and pass the updated result to rebuild the deployment plans view
    // buildDeploymentPlans(deploymentPlans);  ### Remove the comment when the deploymentPlans array is updated
}

function getSoftwareComponentHTML(softwareComponent, status, planIndex, deploymentIndex) {
    return `<div class="col-6">
        <div class="card">
            <div class="card-body">
                <h4>${softwareComponent.name}</h4>
                <p>${softwareComponent.version}</p>
                <div class="form-check">
                    <input class='form-check-input' type='checkbox' id='check_install_status'
                        onclick='installComponent(${JSON.stringify(softwareComponent)}, ${planIndex}, ${deploymentIndex})' ${status}>
                    <label class="form-check-label" for="check_install_status">
                        Installed
                    </label>
                </div>
            </div>            
        </div>
    </div>`;
}

function getDeploymentHTML(deployment, softwareComponents) {
    return `<div class="col-6">
        <div class="card">
            <div class="card-header">
                <h3>${deployment.device.name}</h3>
                <p>${deployment.device.description}</p>
            </div>
            <div class="card-body">
                <div class="row">
                    ${softwareComponents.join('')}
                </div>
            </div>            
        </div>
    </div>`;
}

function getPlanHTML(plan, deployments) {
    return `<div class="col-12">
        <div class="card border-success mb-4">
            <div class="card-header">
                <h2>${plan.name}</h2>
                <p>${plan.description}</p>
            </div>
            <div class="card-body">
                <div class="row">
                    ${deployments.join('')}
                </div>
            </div>            
        </div>
    </div>`;
}