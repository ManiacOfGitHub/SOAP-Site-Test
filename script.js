$("#switchTheme").click(()=>{
    if($("html").attr("data-bs-theme")) {
        $("html").removeAttr("data-bs-theme");
        $("#switchTheme").text("dark_mode");
    } else {
        $("html").attr("data-bs-theme","dark");
        $("#switchTheme").text("light_mode");
    }
});

$("#recipient").on("change", function(){
    if(this.value=="none") {
        $("#recipientAccordion").hide();
        $("#beginSoap").addClass("btn-secondary").removeClass("btn-primary").attr("disabled");
        return;
    }
    $("#beginSoap").addClass("btn-primary").removeClass("btn-secondary").removeAttr("disabled");
    $("#recipientAccordion").show();
    if(this.value=="appTest") {
        $("#kurisuUploadSerial").hide();
        $("#essentialSubmitSerial").show();
        $("#serialMatch").text("MISMATCH").removeClass("text-success").addClass("text-danger");
    } else if(this.value=="kurisuTest") {
        $("#kurisuUploadSerial").show();
        $("#essentialSubmitSerial").hide();
        $("#serialMatch").text("MATCH").removeClass("text-danger").addClass("text-success");
    }
    $("#lastTransfer").text((new Date(Date.now()-10*24*60*60*1000)).toLocaleString());
})

$("#donor").on("change", donorUpdate);

function donorUpdate() {
    $("#donorAccordion").show();
    if(this.value=="donor1") {
        $("#donorSerial").text("XX000000002");
        $("#donorRegion").text("USA");
        $("#lastTransferDonor").text("11/27/2024 00:00");
        $("#donorCooldown").text("NONE").removeClass("text-danger").addClass("text-success");
    } else if(this.value=="donor2") {
        $("#donorSerial").text("XX000000003");
        $("#donorRegion").text("JPN");
        $("#lastTransferDonor").text("12/4/2024 00:00");
        $("#donorCooldown").text("4 days").removeClass("text-success").addClass("text-danger");
    }
}

donorUpdate.call($("#donor")[0]);

$("#beginSoap").click(async()=>{
    (new bootstrap.Modal($("#soapModal"),{keyboard:false,backdrop:"static"})).show();
    $("#recipientCheckStatus").addClass("soapModalRowLoading");
    $("#soapTransferComplete").addClass("soapModalRowLoading");
    await new Promise(resolve=>setTimeout(resolve,2000));
    $("#recipientCheckStatus").removeClass("soapModalRowLoading").addClass("soapModalRowSuccess");
    $("#regionChangeStatus").addClass("soapModalRowLoading");
    await new Promise(resolve=>setTimeout(resolve,2000));
    if($("#recipient")[0].value=="appTest") {
        $("#regionChangeStatus").removeClass("soapModalRowLoading").addClass("soapModalRowSuccess");
        $("#donorCheckStatus .pendingIcon").text("info");
        $("#sysTransferStatus .pendingIcon").text("info");
        $("#soapTransferComplete").removeClass("soapModalRowLoading").addClass("soapModalRowSuccess");
        $($("#donorCheckStatus")[0].children[1]).text("Check donor (Not Needed)");
        $($("#sysTransferStatus")[0].children[1]).text("SysTransfer (Not Needed)");
        $($("#soapTransferComplete")[0].children[1]).text("SOAP Transfer Complete!");
        $("#soapTransferFinishedMsg").text("This SOAP Transfer did not require a system transfer! No donor was used!");
        return;
    }
    $("#regionChangeStatus").removeClass("soapModalRowLoading").addClass("soapModalRowFail");
    $("#donorCheckStatus").addClass("soapModalRowLoading");
    await new Promise(resolve=>setTimeout(resolve,2000));
    $("#donorCheckStatus").removeClass("soapModalRowLoading").addClass("soapModalRowSuccess");
    $("#sysTransferStatus").addClass("soapModalRowLoading");
    await new Promise(resolve=>setTimeout(resolve,2000));
    $("#sysTransferStatus").removeClass("soapModalRowLoading").addClass("soapModalRowSuccess");
    $("#soapTransferComplete").removeClass("soapModalRowLoading").addClass("soapModalRowSuccess");
    $($("#soapTransferComplete")[0].children[1]).text("SOAP Transfer Complete!");
    $("#soapTransferFinishedMsg").text("This SOAP Transfer required a system transfer to a donor console.");
})