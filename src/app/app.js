(function () {
    angular.module('app', [])
        .factory('notesFactory', notesFactory)
        .directive('notepad', notepad);

    function notepad(notesFactory) {
        return {
            restrict: 'AE',
            scope: {},
            templateUrl: 'app/notepad.tpl.html',
            link: function (scope, elem, attrs) {
                scope.delete = function (id) {
                    scope.notes = notesFactory.delete(id);
                    scope.restore();
                };
                scope.openEditor = function (id) {
                    scope.editMode = true;
                    if (id !== undefined) {
                        scope.noteText = notesFactory.get(id).content;
                        scope.index = id;
                    } else {
                        scope.noteText = undefined;
                    }
                };
                scope.save = function () {
                    if (scope.noteText !== "" && scope.noteText !== undefined) {
                        var note = {};
                        note.title = scope.noteText.length > 10 ? scope.noteText.substring(0, 10) + '. . .' : scope.noteText;
                        note.content = scope.noteText;
                        note.id = scope.index != -1 ? scope.index : Math.random();;
                        scope.notes = notesFactory.put(note);
                    }
                    scope.restore();
                };


                scope.restore = function () {
                    scope.editMode = false;
                    scope.index = -1;
                    scope.noteText = "";
                };

                var editor = elem.find('#editor');

                scope.restore();

                scope.notes = notesFactory.getAll();

                editor.bind('keyup keydown', function () {
                    scope.noteText = editor.text().trim();
                });

            }
        };
    }

    function notesFactory() {
        return {
            delete: function (id) {
                localStorage.removeItem('note' + id);
                return this.getAll();
            },
            put: function (note) {
                localStorage.setItem('note' + note.id, JSON.stringify(note));
                return this.getAll();
            },
            get: function (id) {
                return JSON.parse(localStorage.getItem('note' + id));
            },
            getAll: function () {
                var notes = [];
                for (var i = 0; i < localStorage.length; i++) {
                    if (localStorage.key(i).indexOf('note') !== -1) {
                        var note = localStorage.getItem(localStorage.key(i));
                        notes.push(JSON.parse(note));
                    }
                }
                return notes;
            }
        };
    }
})();