define(function(){
    return {

        init(browser,plugin) {
            let thisb = this;
            this.browser = browser;
            this.plugin = plugin; 
            //console.log("JBlast toolmenu init");
            require([
                'dojo/dom-construct',
                'dijit/MenuItem',
                'dijit/Dialog',
                'dijit/form/Button',
                'plugins/JBlast/js/queryDialog'
            ], function(dom,dijitMenuItem,Dialog,dButton,queryDialog){
                
                browser.addGlobalMenuItem( 'tools', new dijitMenuItem({
                    id: 'menubar_blast_seq',
                    label: 'BLAST DNA sequence',
                    //iconClass: 'dijitIconFilter',
                    onClick: function() {
                        //console.log(thisb,thisb.plugin);
                        thisb.plugin.getWorkflows(function(workflows){

                            if (workflows.length==0) {
                                alert("no workflows found");
                                return;
                            }
                                           
                            var dialog = new queryDialog({
                                browser:thisb.browser,
                                plugin:thisb.plugin,
                                workflows:workflows
                            }); 
                            dialog.show(function(x) {
                            });
                        });                       
                    }
                }));
                
                browser.addGlobalMenuItem( 'tools', new dijitMenuItem({
                    id: 'menubar_blast_hilite',
                    label: 'BLAST highlighted region',
                    //iconClass: 'dijitIconFilter',
                    onClick: function() {
                        let btnState = $("[widgetid*='highlight-btn'] > input").attr('aria-checked');
                        if (btnState==='false') {
                            // it takes a few iterations for the state to change.
                            let check = setInterval(function(){
                                $("[widgetid*='highlight-btn'] > input").click();
                                btnState = $("[widgetid*='highlight-btn'] > input").attr('aria-checked');
                                if (btnState !== 'false') {
                                    clearInterval(check);

                                    // show highlight instruct box
                                    var confirmBox = new Dialog({ title: 'Highlight region to BLAST' });
                                    dojo.create('div', {
                                        id: 'confirm-btn',
                                        innerHTML: 'Highlight region by clicking the start start coordinate and dragging to the end coordinate.  Then click "BLAST" button.'
                                    }, confirmBox.containerNode );
                                    confirmBox.show();

                                    // close confirm box
                                    setTimeout(function(){ confirmBox.destroyRecursive(); }, 4000);

                                }
                            },100);   
                        }
                    }
                }));
                browser.addGlobalMenuItem( 'tools', new dijitMenuItem({
                    id: 'menubar_jblast_dbclean',
                    label: 'Clear demo data',
                    //iconClass: 'dijitIconFilter',
                    onClick: function() {

                        // show confirm dialog
                        let confirmCleanBox = new Dialog({ title: 'Confirm Demo Cleanup',id:'demo-clean-confirm-dialog' });

                        dom.create('div', {
                            id: 'descript',
                            innerHTML: 'This is a demo-only feature that will clean up the<br>job queue and tracks.  Are you sure you want to do this?'
                        }, confirmCleanBox.containerNode );

                        new dButton({
                            id: 'yes',
                            label: 'Yes',
                            //iconClass: 'dijitIconDelete',
                            onClick: function() {
                                //alert('ding');
                                $.post( "/util/democleanup",{}, function( data) {
                                    console.log("demo cleaned up");
                                });
                                confirmCleanBox.destroyRecursive();
                                //confirmCleanBox.hide();
                            }
                        })
                        .placeAt( confirmCleanBox.containerNode );
                
                        new dButton({
                            id: 'no',
                            label: 'No',
                            //iconClass: 'dijitIconDelete',
                            onClick: function() {
                                confirmCleanBox.destroyRecursive();
                                //confirmCleanBox.hide();
                            }
                        })
                        .placeAt( confirmCleanBox.containerNode );
                
                        confirmCleanBox.show();
                    
                    }
                }));
                
                browser.renderGlobalMenu( 'tools','JBlastTools', browser.menuBar );
    
                // reorder the menubar
                $("[widgetid*='dropdownbutton_tools']").insertBefore("[widgetid*='dropdownbutton_help']");
                $("[widgetid*='dropdownbutton_tools'] span.dijitButtonNode").html(" JBlast");

            });

        }
    }
});