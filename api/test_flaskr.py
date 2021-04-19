import os
import tempfile

import pytest


@pytest.fixture
def client():
    a=1


def test_client(client):
    assert True