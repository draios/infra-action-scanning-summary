const fs = require('fs');
const core = require('@actions/core');
const { isAsyncFunction } = require('util/types');

async function vulnerabilitiesReport(){
  var scannerOutputJS = JSON.parse(fs.readFileSync(core.getInput('report-file-path'), 'utf-8'))
  let packageListTable = [
    [
      {data: 'Package', header: true},
      {data: 'Type', header: true},
      {data: 'Version', header: true},
      {data: 'Suggested fix', header: true},
      {data: 'Critical', header: true},
      {data: 'High', header: true},
      {data: 'Medium', header: true},
      {data: 'Low', header: true},
      {data: 'Negligible', header: true}
    ]
  ]
  for (const package of scannerOutputJS.packages.list.slice(0,scannerOutputJS.vulnerabilities.total)){
    if ( package.vulnerabilities.length > 0 ){
      packageList =[
      package.name, package.type, package.version, (package.suggestedFix ||  "Unknown"),
      package.vulnsBySeverity.filter(v => v.severity.label == "Critical")[0].total.toString(),
      package.vulnsBySeverity.filter(v => v.severity.label == "High")[0].total.toString(),
      package.vulnsBySeverity.filter(v => v.severity.label == "Medium")[0].total.toString(),
      package.vulnsBySeverity.filter(v => v.severity.label == "Low")[0].total.toString(),
      package.vulnsBySeverity.filter(v => v.severity.label == "Negligible")[0].total.toString()
    ]
    packageListTable.push(packageList)
    }
  }

  await core.summary
  .addHeading('Sysdig Scanner')
  .addRaw("Container Image: " + scannerOutputJS.metadata.pullString).addBreak()
  .addRaw("Image ID: " + scannerOutputJS.metadata.imageID).addBreak()
  .addRaw("BaseOS: " + scannerOutputJS.metadata.baseOS).addBreak().write()
  if ("resultURL" in scannerOutputJS.info){
    await core.summary.addLink('Scanner Result Link', scannerOutputJS.info.resultURL).addBreak().addBreak().write()
  } else {
    await core.summary.addBreak().addBreak().write()
  }
  await core.summary.addRaw(scannerOutputJS.vulnerabilities.total + " vulnerabilities found").addBreak()
  .addRaw(":red_circle: " + scannerOutputJS.vulnerabilities.bySeverity.filter(v=> v.severity.label == "Critical")[0].total + " Critical").addBreak()
  .addRaw(":orange_circle: " + scannerOutputJS.vulnerabilities.bySeverity.filter(v=> v.severity.label == "High")[0].total + " High").addBreak()
  .addRaw(":yellow_circle: " + scannerOutputJS.vulnerabilities.bySeverity.filter(v=> v.severity.label == "Medium")[0].total + " Medium").addBreak()
  .addRaw(":green_circle: " + scannerOutputJS.vulnerabilities.bySeverity.filter(v=> v.severity.label == "Low")[0].total + " Low").addBreak()
  .addRaw(":large_blue_circle: " + scannerOutputJS.vulnerabilities.bySeverity.filter(v=> v.severity.label == "Negligible")[0].total + " Negligible").addBreak()
  .addSeparator()
  .addTable(packageListTable)
  .write()
}

try {
  vulnerabilitiesReport();
} catch (error) {
  core.setFailed(error.message);
}
