var myMap, route;
ymaps.ready(init);

function init() {
    myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчнию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [55.7, 37.31],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 7,
        controls: []

    })
    //переменные для данных с формы
    var form = document.forms.forma;

    //загрузка точек в массив
    function find() {

        var wayPoints = [];
        var start = form.elements.start_point.value;
        if (isEmpty(start)) wayPoints.push(start);
        else alert("Старт обязателен");

        var position2 = form.elements.point2.value;
        if (isEmpty(position2)) wayPoints.push(position2);

        var position3 = form.elements.point3.value;
        if (isEmpty(position3)) wayPoints.push(position3);

        var end = form.elements.end_point.value;
        if (isEmpty(end)) wayPoints.push(end);
        else alert("Финиш обязателен");


        //передача массива на Я для построения маршрута
        ymaps.route(wayPoints, {
            mapStateAutoApply: true
        }).then(function (router) {

            //удаление существуюшего маршрута если имеется
            route && myMap.geoObjects.remove(route);
            route = router;
            //добавление нового
            myMap.geoObjects.add(route);
            
            //выборка статистики из маршрута и отображение на странице
            var gresult = "Общая длина маршрута " + route.getHumanLength() + " время в пути " + route.getHumanTime();
            document.getElementById('geninfo').innerHTML = gresult;

            var points = route.getWayPoints();

            var wayPointsStats = '';
            for (var index = 0; index < points.getLength(); ++index) {
                wayPointsStats = wayPointsStats + points.get(index).properties.get("name") + " - шир. " + points.get(index).geometry.getCoordinates()[0] + " долг. " + points.get(index).geometry.getCoordinates()[1] + "<br>";

            }
            document.getElementById('coorinfo').innerHTML = wayPointsStats;

            points.options.set('preset', 'twirl#redStretchyIcon');
            points.get(0).properties.set('iconContent', 'Точка отправления');
            points.get(points.getLength() - 1).properties.set('iconContent', 'Точка прибытия');

        }, function (error) {
            alert("Возникла ошибка: " + error.message);
        });

        return false;
    };

    //обработка нажатия на кнопку
    document.getElementById('btn').addEventListener('click', find);
};

//валидация строки на пустоту
function isEmpty(str) {
    if (str != null && typeof str !== "undefined") {
        str = str.trim();
    }

    if (!str) {
        return false;
    } else return true;
}
