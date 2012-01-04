var Exercise = { title: "Exercise Name", desc: "", problems: [] };

$(function() {
	$("#code-tabs").tabs({
		show: function( e, ui ) {
			var editorElem = $( ui.panel ).find( ".editor" ),
				editor = editorElem.data( "editor" );
			
			if ( !editor ) {
				editor = new Editor( editorElem[0].id );
				editorElem.data( "editor", editor );
			}
		}
	});
	
	insertExerciseForm( Exercise );
	makeProblem();
});

var makeProblem = function() {
	var problem = { title: "Problem #" + (Exercise.problems.length + 1), desc: "" };
	insertExerciseForm( problem );
	
	// TODO: Populate main form and sync it to object
};

var insertExerciseForm = function( testObj ) {
	$( $("#form-tmpl").html() )
		.find( "a" ).text( testObj.title ).end()
		.find( "input" ).val( testObj.title ).end()
		.appendTo( "#tests" )
		.find( "form" ).change(function( e ) {
			var elem = e.target;
			
			testObj[ elem.name ] = elem.value;
			
			if ( elem.name === "test" ) {
				$(this).parent().prev().find("a").text( elem.value );
			}
		});
	
	$( "#tests" ).accordion( "destroy" ).accordion({ active: ":last" });
};