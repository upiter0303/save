var postMain = {
    init: function() {
        var func = this;
        $('#btn-save').on('click', function() {
            func.save();
        });

        $('#btn-postDelete').on('click', function() {
            func.postDelete();
        });

        $('#btn-attention').on('click', function() {
            func.attention();
        });

        $('#btn-chatOpen').on('click', function() {
            func.chatOpen();
        });

        $('#btn-setReview').on('click', function() {
            func.setReview();
        });
    },

    save : function() {
        if ($('#title').val() === "") {
            alert("제목을 입력해주세요");
            $('#title').focus();
            return;
        }
        if ($('#category').val() === 'x') {
            alert("카테고리를 선택해주세요");
            $('#category').focus();
            return;
        }
        if ($('#price').val() === "") {
            alert("가격을 입력해주세요");
            $('#price').focus();
            return;
        }
        var priceTest = /^[0-9]*$/g;
        if(!priceTest.test($('#price').val())) {
            alert("가격에는 숫자만 입력 가능합니다");
            $('#price').focus();
            return;
        }
        var checkList = "";
        if ($('#direct').is(':checked')) {
            checkList = "A";
        }
        if ($('#delivery').is(':checked')) {
            checkList += "B";
        }
        if ($('#direct').is(":checked") === false && $('#delivery').is(':checked') === false) {
            alert("거래방식은 최소 한개 이상 선택하셔야 합니다");
            $('#check1').focus();
            return;
        } else {
            $('#way').val(checkList);
        }
        var ofSize = null;
        if ($('#size3').val() !== "") {
            if ($('#size2').val() !== "") {
                if ($('#size1').val() !== "") {
                    ofSize = $('#size1').val();
                } else {
                    alert("\'가로\'부터 채워주세요");
                    return;
                }
                ofSize += "*"+$('#size2').val();
            } else {
                alert("\'세로\'부터 채워주세요");
                return;
            }
            ofSize += "*"+$('#size3').val();
            $('#ofSize').val(ofSize);
        }
        if ($('#content').val() === "") {
            alert("내용을 입력해주세요");
            $('#content').focus();
            return;
        }
        if ($('#subType').val() === "save") {
            if (!$('#formFileMultiple').val()) {
                alert("사진을 하나 이상 첨부하셔야 합니다");
                return;
            }
        } else {
            var ele = document.getElementById('att_zone');
            var eleCount = ele.childElementCount;
            if (!$('#formFileMultiple').val() && eleCount === 0) {
                alert("사진을 하나 이상 첨부하셔야 합니다");
                return;
            }
        }
        var form = $('#postForm');
        var fileName = $('#toDelFile').val();
        $.ajax({
            type: 'delete',
            url: '/post/files/del',
            data: {
                fileName: fileName
            },
            contentType: "application/x-www-form-urlencoded; charset=UTF-8"
        }).done(function() {
            console.log("del file")
        }).fail(function(error) {
            console.error(JSON.stringify(error));
        });
        form.submit();
    },

    postDelete: function () {
        var check = confirm("정말 삭제하시겠습니까?");
        if (check) {
            var form = $('#deleteForm');
            form.submit();
        } else {

        }
    },

    attention: function () {
        var info = {
            userId: $('#userId').val(),
            postNo: $('#postNo').val()
        };
        if (info.userId == "guest") {
            var login = confirm("로그인한 사용자만 가능합니다. 로그인 하시겠습니까?");
            if (login) {
                window.location.href="/loginPage";
            } else {
                return;
            }
        }
        $.ajax({
            type: 'POST',
            url: '/attention/button',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(info)
        }).done(function(result) {
            if (result) {
                alert("찜하기 완료!");
            } else {
                alert("찜 목록에서 삭제되었습니다");
            }
        }).fail(function(error) {
            console.error(JSON.stringify(error));
            alert('다시 시도해주세요');
        });
    },

    chatOpen: function () {
        var userId = $('#userId').val();
        var postNo = $('#postNo').val();
        if (userId == "guest") {
            var login = confirm("로그인한 사용자만 가능합니다. 로그인 하시겠습니까?");
            if (login) {
                window.location.href="/loginPage";
            } else {
                return;
            }
        }
        window.open("/chat/" + postNo + "/" + userId, "", "_blank");
    },

    setReview: function () {
        var info = {
            id: $('#id').val(),
            no: $('#no').val(),
            position: $('#position').val(),
            score: $('#score').val()
        };
        $.ajax({
            type: 'put',
            url: '/post/review/set',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(info)
        }).done(function() {
            alert("리뷰가 작성되었습니다");
            window.location.href="/myPage";
        }).fail(function(error) {
            console.error(JSON.stringify(error));
            alert('다시 시도해주세요');
        });
    }

};
postMain.init();

imageView = function imageView(att_zone, btn) {

    var attZone = document.getElementById(att_zone);
    var btnAtt = document.getElementById(btn);
    var sel_files = [];

    // 이미지와 체크 박스를 감싸고 있는 div 속성
    var div_style = 'display:inline-block;position:relative;'
        + 'width:150px;height:120px;margin:5px;border:1px solid #00f;z-index:1';
    // 미리보기 이미지 속성
    var img_style = 'width:100%;height:100%;z-index:none';
    // 이미지안에 표시되는 체크박스의 속성
    var chk_style = 'width:30px;height:30px;position:absolute;font-size:24px;'
        + 'right:0px;bottom:0px;z-index:999;background-color:rgba(255,255,255,0.1);color:#f00';

    btnAtt.onchange = function (e) {
        var files = e.target.files;
        var fileArr = Array.prototype.slice.call(files)
        for (f of fileArr) {
            imageLoader(f);
        }
    }
// 탐색기에서 드래그앤 드롭 사용
    attZone.addEventListener('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false)

    attZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();

    }, false)

    attZone.addEventListener('drop', function (e) {
        var files = {};
        e.preventDefault();
        e.stopPropagation();
        var dt = e.dataTransfer;
        files = dt.files;
        for (f of files) {
            imageLoader(f);
        }

    }, false)
    /*첨부된 이미리즐을 배열에 넣고 미리보기 */
    imageLoader = function (file) {
        sel_files.push(file);
        var reader = new FileReader();
        reader.onload = function (ee) {
            let img = document.createElement('img')
            img.setAttribute('style', img_style)
            img.src = ee.target.result;
            attZone.appendChild(makeDiv(img, file));
        }

        reader.readAsDataURL(file);
    }

    /*첨부된 파일이 있는 경우 checkbox와 함께 attZone에 추가할 div를 만들어 반환 */
    makeDiv = function (img, file) {
        var div = document.createElement('div')
        div.setAttribute('style', div_style)

        var btn = document.createElement('input')
        btn.setAttribute('type', 'button')
        btn.setAttribute('value', 'x')
        btn.setAttribute('delFile', file.name);
        btn.setAttribute('style', chk_style);
        btn.onclick = function (ev) {
            var ele = ev.srcElement;
            var delFile = ele.getAttribute('delFile');
            for (var i = 0; i < sel_files.length; i++) {
                if (delFile == sel_files[i].name) {
                    sel_files.splice(i, 1);
                }
            }

            dt = new DataTransfer();
            for (f in sel_files) {
                var file = sel_files[f];
                dt.items.add(file);
            }
            btnAtt.files = dt.files;
            var p = ele.parentNode;
            attZone.removeChild(p)
        }
        div.appendChild(img)
        div.appendChild(btn)
        return div
    }
}
imageView('att_zone', 'formFileMultiple')



var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };

//지도를 미리 생성
var map = new daum.maps.Map(mapContainer, mapOption);
//주소-좌표 변환 객체를 생성
var geocoder = new daum.maps.services.Geocoder();
//마커를 미리 생성
var marker = new daum.maps.Marker({
    position: new daum.maps.LatLng(37.537187, 127.005476),
    map: map
});


function findAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.address; // 최종 주소 변수

            // 주소 정보를 해당 필드에 넣는다.
            document.getElementById("area").value = addr;
            // 주소로 상세 정보를 검색
            geocoder.addressSearch(data.address, function(results, status) {
                // 정상적으로 검색이 완료됐으면
                if (status === daum.maps.services.Status.OK) {

                    var result = results[0]; //첫번째 결과의 값을 활용

                    // 해당 주소에 대한 좌표를 받아서
                    var coords = new daum.maps.LatLng(result.y, result.x);
                    // 지도를 보여준다.
                    mapContainer.style.display = "block";
                    map.relayout();
                    // 지도 중심을 변경한다.
                    map.setCenter(coords);
                    // 마커를 결과값으로 받은 위치로 옮긴다.
                    marker.setPosition(coords)
                }
            });
        }
    }).open();
}